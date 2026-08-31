const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================================
// Middleware
// ================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

// ================================
// API Health Check
// ================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CollabBoard API is running",
  });
});

// ================================
// Export App
// ================================

module.exports = app;
