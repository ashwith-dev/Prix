const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Normal index for faster lookup
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['PRICE_DROP', 'PRICE_INCREASE', 'RESTOCK'],
      default: 'PRICE_DROP',
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

// TTL index to automatically delete notifications after 2 days (172800 seconds)
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });

module.exports = mongoose.model('Notification', NotificationSchema);
