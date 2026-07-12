const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth');

// All notification routes are protected
router.use(authMiddleware);

router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markAsRead);

module.exports = router;
