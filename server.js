import express from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";
import connectDB from "./src/db/connectDB.js";
import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import Cloudinary from "./src/utils/Cloudinary.js";
import authRoutes from "./src/routes/authRoutes.js";
import zoomRoutes from './src/routes/zoom.js';  

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://job-portal-frontend-seven-theta.vercel.app',
  'https://job-portal-backend-kfkrprfwo-hariharakumar-rs-projects.vercel.app',
  'http://localhost:3000'  // For local development
];

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'x-csrf-token'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS before any routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
Cloudinary();

app.get("/", (req, res) => res.send("api is working"));

// Add this after your routes but before app.listen()

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      success: false,
      message: 'CORS origin not allowed',
    });
  } else {
    next(err);
  }
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Move error handling middleware after routes
app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/interviews", interviewRoutes);
app.use("/zoom", zoomRoutes);
app.use("/user", userRoutes);
app.use("/company", companyRoutes);
app.use("/job", jobRoutes);

// Add this at the end
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`🌐Server is running on port ${PORT}`)
);
