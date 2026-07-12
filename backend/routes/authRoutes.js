const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateSettings } = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Routes (Require JWT)
router.get('/profile', authMiddleware, getProfile);
router.put('/settings', authMiddleware, updateSettings);

module.exports = router;
