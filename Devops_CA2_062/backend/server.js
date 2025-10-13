//const dotenv = require("dotenv");
require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/auth");
const codingRoutes = require("./src/routes/coding");
const resumeRoutes = require("./src/routes/resume"); 
const interviewRoutes = require("./src/routes/interview");
const metricsRoutes = require("./src/routes/metrics");

const app = express();

app.use(cors());
app.use(express.json());

// Metrics endpoint (no /api prefix for Prometheus)
app.use(metricsRoutes);

// API routes
app.use("/api/interview", interviewRoutes);
app.use("/api/coding", codingRoutes); 
app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'https://accounts.google.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  next();
});

// simple health check
app.get("/", (req, res) => res.send("API up"));

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT,"0.0.0.0", () =>
      console.log("✅ Server running on port", process.env.PORT)
    );
  } catch (err) {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  }
}

start();
console.log('VERSION 2.0 - Updated');