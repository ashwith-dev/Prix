require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Prix Backend is running' });
});

// Auth Routes placeholder
app.post('/api/auth/google', (req, res) => {
  res.json({ message: 'Google auth placeholder' });
});

// Products & Wishlist Routes placeholder
app.get('/api/wishlist', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
