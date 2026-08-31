const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
require("dotenv").config();

const app = express();

// ================================
// Security Middleware
// ================================

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP parameter pollution
app.use(hpp());

// ================================
// CORS Configuration
// ================================
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL || 'https://your-production-client.com']
  : ['http://localhost:3000', 'http://localhost:5173']; // Add dev origins

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ================================
// Core Middleware
// ================================
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ================================
// Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ================================
// API Health Check
// ================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CollabBoard API is running",
    environment: process.env.NODE_ENV || 'development'
  });
});

// ================================
// Error Handler
// ================================
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// ================================
// Export App
// ================================

module.exports = app;
