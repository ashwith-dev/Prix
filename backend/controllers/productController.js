const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const normalizeUrl = require('../utils/normalizeUrl');
const scraperService = require('../services/scraper');

/**
 * @route   POST /api/products
 * @desc    Add a product URL (scrapes if new, then adds to wishlist)
 * @access  Private
 */
const addProduct = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Product URL is required' });
    }

    const normalized_url = normalizeUrl(url);

    // 1. Check if product already exists globally
    let product = await Product.findOne({ normalized_url });

    // 2. If it doesn't exist, scrape and create it
    if (!product) {
      console.log(`Product not found globally. Scraping: ${url}`);
      try {
        const scrapedData = await scraperService.scrapeProduct(url);
        
        product = await Product.create({
          original_url: url,
          normalized_url,
          name: scrapedData.name,
          image: scrapedData.image,
          category: scrapedData.category,
          current_price: scrapedData.current_price,
          lowest_price: scrapedData.current_price,
          highest_price: scrapedData.current_price,
        });
      } catch (scrapeError) {
        return res.status(422).json({ message: 'Failed to scrape product data', error: scrapeError.message });
      }
    } else {
      console.log(`Product already exists in DB. Bypassing scrape for: ${normalized_url}`);
    }

    // 3. Add to User's Wishlist
    try {
      const wishlistEntry = await Wishlist.create({
        user_id: req.user.id,
        product_id: product._id,
        price_when_added: product.current_price,
      });

      res.status(201).json({
        message: 'Product added to wishlist successfully',
        product,
        wishlist_entry: wishlistEntry
      });
    } catch (wishlistError) {
      // E11000 duplicate key error means they already have it in their wishlist
      if (wishlistError.code === 11000) {
        return res.status(400).json({ message: 'Product is already in your wishlist', product });
      }
      throw wishlistError;
    }

  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ message: 'Server error while adding product' });
  }
};

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user_id: req.user.id })
      .populate('product_id')
      .sort({ added_at: -1 });

    // Format the response to flatten it slightly for the frontend
    const formattedWishlist = wishlist.map(item => ({
      wishlist_id: item._id,
      price_when_added: item.price_when_added,
      added_at: item.added_at,
      product: item.product_id
    }));

    res.json(formattedWishlist);
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
};

/**
 * @route   DELETE /api/wishlist/:productId
 * @desc    Remove product from wishlist
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedItem = await Wishlist.findOneAndDelete({
      user_id: req.user.id,
      product_id: productId
    });

    if (deletedItem) {
      res.json({ message: 'Product removed from wishlist successfully' });
    } else {
      res.status(404).json({ message: 'Product not found in your wishlist' });
    }
  } catch (error) {
    console.error('Remove Wishlist Error:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
};

/**
 * @route   GET /api/products/:productId/deal
 * @desc    Get original URL for a product
 * @access  Private
 */
const getProductDeal = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId).select('original_url');
    
    if (product) {
      res.json({ original_url: product.original_url });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Get Deal Error:', error);
    res.status(500).json({ message: 'Server error while fetching product deal' });
  }
};

/**
 * @route   GET /api/products/:productId/share
 * @desc    Get shareable text for a product
 * @access  Private
 */
const getProductShare = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId).select('original_url');
    
    if (product) {
      res.json({ 
        message: "Check out this product!\n" + product.original_url 
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Share Error:', error);
    res.status(500).json({ message: 'Server error while sharing product' });
  }
};

module.exports = {
  addProduct,
  getWishlist,
  removeFromWishlist,
  getProductDeal,
  getProductShare,
};
