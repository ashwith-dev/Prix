const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user & get token
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached to req object by auth middleware
    res.json(req.user);
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * @route   PUT /api/auth/settings
 * @desc    Update user settings (e.g. FCM token, notification preference)
 * @access  Private
 */
const updateSettings = async (req, res) => {
  try {
    const { fcm_token, notification_enabled } = req.body;

    const user = await User.findById(req.user.id);

    if (user) {
      if (fcm_token !== undefined) {
        user.fcm_token = fcm_token;
      }
      if (notification_enabled !== undefined) {
        user.notification_enabled = notification_enabled;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        fcm_token: updatedUser.fcm_token,
        notification_enabled: updatedUser.notification_enabled,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Settings Update Error:', error);
    res.status(500).json({ message: 'Server error updating settings' });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateSettings,
};
