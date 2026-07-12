const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    price_when_added: {
      type: Number,
      required: true,
    },
    added_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    // Do not use timestamps: true if we only need added_at, but we can leave it off based on spec
  }
);

// Compound unique index to prevent duplicate wishlist entries
WishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
