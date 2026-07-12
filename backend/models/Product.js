const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    original_url: {
      type: String,
      required: true,
    },
    normalized_url: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    current_price: {
      type: Number,
      required: true,
    },
    last_price: {
      type: Number,
      default: null,
    },
    lowest_price: {
      type: Number,
      required: true,
    },
    highest_price: {
      type: Number,
      required: true,
    },
    price_change_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    price_change_percent: {
      type: Number,
      required: true,
      default: 0,
    },
    price_direction: {
      type: String,
      required: true,
      enum: ['UP', 'DOWN', 'SAME'],
      default: 'SAME',
    },
    availability: {
      type: String,
      required: true,
      default: 'IN_STOCK',
    },
    refresh_level: {
      type: String,
      required: true,
      enum: ['HOT', 'NORMAL', 'STABLE', 'VERY_STABLE', 'ARCHIVED'],
      default: 'HOT',
    },
    stable_days: {
      type: Number,
      required: true,
      default: 0,
    },
    sale_mode: {
      type: Boolean,
      required: true,
      default: false,
    },
    last_checked: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
