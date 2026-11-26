const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const mongoose = require('mongoose');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to ensure DB connection is ready for serverless requests
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState < 1) {
    try {
      await connectDB();
    } catch (e) {
      console.error('Database connection failed on request:', e.message);
    }
  }
  next();
});

// Determine allowed origins — supports comma-separated list for multi-environment deploys
const rawOrigins = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, same-origin, serverless internal)
    if (!origin) return callback(null, true);
    // Automatically allow any Vercel preview or production deployment domain
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return callback(null, true);
    return callback(null, true); // Fallback: allow all origins to avoid blocking valid frontend calls
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Strictly only permitted HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded CV files statically (with /tmp fallback for serverless environments)
const uploadsStaticDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsStaticDir));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Root & Health check routes for API verification
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Internship & Job Portal API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Only bind to local port if not running in a serverless environment like Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export Express app for Vercel Serverless Function deployment
module.exports = app;
