const express = require('express');
const router = express.Router();
const { addProduct, getWishlist, removeFromWishlist, getProductDeal } = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

// All product & wishlist routes are protected
router.use(authMiddleware);

// Products
router.post('/products', addProduct);
router.get('/products/:productId/deal', getProductDeal);
router.get('/products/:productId/share', getProductShare);

// Wishlist
router.get('/wishlist', getWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;
