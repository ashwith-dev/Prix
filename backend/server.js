require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { initScheduler } = require('./cron/priceScheduler');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); // Contains /products and /wishlist
app.use('/api', notificationRoutes); // Contains /notifications

// Health check routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Prix Backend is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Prix Backend is running' });
});

// Start Scheduler
initScheduler();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
