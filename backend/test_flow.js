require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Wishlist = require('./models/Wishlist');
const Notification = require('./models/Notification');
const { refreshPricesJob } = require('./cron/priceScheduler');

const runTests = async () => {
  try {
    await connectDB();
    console.log('--- Starting Integration Tests ---');

    // 1. Clear DB
    await User.deleteMany({});
    await Product.deleteMany({});
    await Wishlist.deleteMany({});
    await Notification.deleteMany({});
    console.log('Database cleared for testing.');

    // 2. Create User 1
    const { signup } = require('./controllers/authController');
    const req1 = { body: { name: 'User 1', email: 'test1@test.com', password: 'password123' } };
    let res1Json = null;
    const res1 = { status: () => ({ json: (data) => { res1Json = data; } }) };
    await signup(req1, res1);
    console.log('User 1 signed up:', res1Json.email);

    // 3. Create User 2
    const req2 = { body: { name: 'User 2', email: 'test2@test.com', password: 'password123' } };
    let res2Json = null;
    const res2 = { status: () => ({ json: (data) => { res2Json = data; } }) };
    await signup(req2, res2);
    console.log('User 2 signed up:', res2Json.email);

    // 4. User 1 adds product (Scrape will happen)
    const { addProduct } = require('./controllers/productController');
    const reqAdd1 = { user: { id: res1Json._id }, body: { url: 'https://www.amazon.in/dp/B08N5WRWNW' } };
    let resAdd1Json = null;
    const resAdd1 = { status: () => ({ json: (data) => { resAdd1Json = data; } }) };
    await addProduct(reqAdd1, resAdd1);
    console.log('User 1 added product:', resAdd1Json.product.name);

    // 5. User 2 adds SAME product (Should bypass scrape)
    const reqAdd2 = { user: { id: res2Json._id }, body: { url: 'https://www.amazon.in/gp/product/B08N5WRWNW' } };
    let resAdd2Json = null;
    const resAdd2 = { status: () => ({ json: (data) => { resAdd2Json = data; } }) };
    await addProduct(reqAdd2, resAdd2);
    console.log('User 2 added same product. Total products in DB:', await Product.countDocuments());

    // 6. Simulate Price Drop (Manually update the product in DB to fake it)
    const product = await Product.findById(resAdd1Json.product._id);
    product.current_price += 1000; // Increase price to fake an old higher price
    await product.save();
    console.log('Faked previous higher price in DB for testing price drop detection.');

    // 7. Run Scheduler Job
    await refreshPricesJob();

    // 8. Check Notifications for User 1
    const { getNotifications } = require('./controllers/notificationController');
    const reqNotif = { user: { id: res1Json._id } };
    let notifJson = null;
    const resNotif = { json: (data) => { notifJson = data; } };
    await getNotifications(reqNotif, resNotif);
    console.log(`User 1 Notifications Count: ${notifJson.length}`);
    if (notifJson.length > 0) {
      console.log('Notification Title:', notifJson[0].title);
    }

    console.log('--- Tests Completed Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
};

runTests();
