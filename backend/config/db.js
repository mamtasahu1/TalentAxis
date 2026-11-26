const mongoose = require('mongoose');

const connectDB = async () => {
  // If connection is already open, reuse it (critical for serverless / Vercel execution)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    console.error('MongoDB Warning: MONGO_URI environment variable is missing.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (!process.env.VERCEL) {
      console.log('Server remaining alive to serve requests; retrying DB connection in 10 seconds...');
      setTimeout(connectDB, 10000);
    }
  }
};

module.exports = connectDB;
