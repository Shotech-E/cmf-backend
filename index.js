const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet"); // Added missing helmet import
require("dotenv").config();

const app = express();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "blob:",
        `https://${process.env.VERCEL_URL || 'cmf-backend-iota.vercel.app'}`
      ],
      connectSrc: [
        "'self'",
        `https://${process.env.VERCEL_URL || 'cmf-backend-iota.vercel.app'}`
      ]
    }
  }
}));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());

// Enable CORS for Vercel deployment
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

// Routes
const memberRoute = require("./src/members/memberRoute");
app.use("/api/auth", memberRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to CMF API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// For Vercel deployment
module.exports = app;

// Local development server
if (require.main === module) {
  const port = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}
