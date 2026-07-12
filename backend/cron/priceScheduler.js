const cron = require('node-cron');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const Notification = require('../models/Notification');
const User = require('../models/User');
const scraperService = require('../services/scraper');
const notificationService = require('../services/notificationService');

// Map refresh levels to minutes
const REFRESH_INTERVALS = {
  HOT: 15,
  NORMAL: 30,
  STABLE: 120, // 2 hours
  VERY_STABLE: 360, // 6 hours
  ARCHIVED: 720, // 12 hours
};
const SALE_MODE_INTERVAL = 5;

/**
 * Calculates if a product needs to be refreshed based on its settings
 */
const needsRefresh = (product) => {
  const now = new Date();
  const lastChecked = new Date(product.last_checked);
  const minutesSinceLastCheck = (now - lastChecked) / (1000 * 60);

  if (product.sale_mode && minutesSinceLastCheck >= SALE_MODE_INTERVAL) return true;
  if (!product.sale_mode && minutesSinceLastCheck >= REFRESH_INTERVALS[product.refresh_level]) return true;

  return false;
};

/**
 * Handles the logic when a price drop is detected
 */
const handlePriceChange = async (product, oldPrice, newPrice) => {
  const price_change_amount = newPrice - oldPrice;
  const price_change_percent = (Math.abs(price_change_amount) / oldPrice) * 100;
  let price_direction = 'SAME';

  if (newPrice < oldPrice) price_direction = 'DOWN';
  else if (newPrice > oldPrice) price_direction = 'UP';

  // Update product fields
  product.last_price = oldPrice;
  product.current_price = newPrice;
  product.price_change_amount = price_change_amount;
  product.price_change_percent = price_change_percent;
  product.price_direction = price_direction;

  if (newPrice < product.lowest_price) product.lowest_price = newPrice;
  if (newPrice > product.highest_price) product.highest_price = newPrice;

  // Reset stability
  product.refresh_level = 'HOT';
  product.stable_days = 0;
  
  await product.save();

  // Notify Users if price went down
  if (price_direction === 'DOWN') {
    const wishlists = await Wishlist.find({ product_id: product._id }).populate('user_id');
    
    for (const item of wishlists) {
      const user = item.user_id;
      
      // Create DB notification
      await Notification.create({
        user_id: user._id,
        product_id: product._id,
        title: 'Price Drop Alert! 🚨',
        message: `${product.name} has dropped to ₹${newPrice}!`,
        type: 'PRICE_DROP'
      });

      // Send Push Notification if enabled
      if (user.notification_enabled && user.fcm_token) {
        await notificationService.sendPushNotification(
          user.fcm_token,
          'Price Drop Alert! 🚨',
          `${product.name} is now ₹${newPrice} (was ₹${oldPrice}). Grab the deal!`,
          { productId: product._id.toString() }
        );
      }
    }
  }
};

/**
 * The main job function that refreshes prices
 */
const refreshPricesJob = async () => {
  console.log('[Scheduler] Running price refresh cycle...');
  try {
    // 1. Fetch all products (In a real massive app, this should be paginated/batched)
    const products = await Product.find({ availability: 'IN_STOCK' });
    let countRefreshed = 0;

    for (const product of products) {
      if (needsRefresh(product)) {
        try {
          console.log(`[Scheduler] Refreshing product: ${product._id}`);
          const scrapedData = await scraperService.scrapeProduct(product.original_url);
          
          const newPrice = scrapedData.current_price;
          const oldPrice = product.current_price;

          if (newPrice > 0 && newPrice !== oldPrice) {
            await handlePriceChange(product, oldPrice, newPrice);
          } else {
            // Price hasn't changed. Update last_checked and potentially downgrade refresh_level
            product.last_checked = new Date();
            // Simple stability logic: Every 24 hours of no change, increment stable_days
            const hoursSinceCreation = (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60);
            product.stable_days = Math.floor(hoursSinceCreation / 24);

            // Adaptive downgrade logic
            if (product.stable_days >= 30) product.refresh_level = 'ARCHIVED';
            else if (product.stable_days >= 14) product.refresh_level = 'VERY_STABLE';
            else if (product.stable_days >= 7) product.refresh_level = 'STABLE';
            else if (product.stable_days >= 2) product.refresh_level = 'NORMAL';

            await product.save();
          }
          countRefreshed++;
        } catch (scrapeError) {
          console.error(`[Scheduler] Failed to scrape ${product._id}:`, scrapeError.message);
        }
      }
    }
    console.log(`[Scheduler] Cycle complete. Refreshed ${countRefreshed} products.`);
  } catch (error) {
    console.error('[Scheduler] Critical Error:', error);
  }
};

// Initialize the cron scheduler (Runs every 5 minutes)
const initScheduler = () => {
  console.log('Initializing Price Refresh Scheduler (Cron)...');
  cron.schedule('*/5 * * * *', refreshPricesJob);
};

module.exports = {
  initScheduler,
  refreshPricesJob // Exported for manual testing
};
