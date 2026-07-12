const Notification = require('../models/Notification');

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id })
      .populate('product_id', 'name image original_url')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      { read: true },
      { new: true }
    );

    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    res.status(500).json({ message: 'Server error while marking notification as read' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
