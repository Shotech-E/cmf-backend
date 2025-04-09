const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// Add helmet for security headers
const helmet = require("helmet"); 
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for some frontend frameworks
        "blob:", // Allow blob URLs
        "https://cmf-frontend.vercel.app",
        "https://cmf-backend-iota.vercel.app"
      ],
      connectSrc: [
        "'self'",
        "https://cmf-frontend.vercel.app",
        "https://cmf-backend-iota.vercel.app"
      ],
      imgSrc: ["'self'", "data:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Other Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: [
    "https://cmf-frontend.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

// Routes
const memberRoute = require("./src/members/memberRoute");
app.use("/api/auth", memberRoute);

// Database Connection
async function main() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10
    });
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start Server
main().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
