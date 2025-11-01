import express from "express";
import cors from "cors";
import "dotenv/config";
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
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'x-csrf-token'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.all('/*splat', cors(corsOptions));  // Changed from '/*' to '*'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register routes
app.use("/api/auth", authRoutes);
// Connect to Database and Cloudinary
connectDB();
Cloudinary();

app.get("/", (req, res) => res.send("api is working"));


// app.use("/users", userRoutes);
// app.use("/interviews", interviewRoutes);
app.use("/zoom", zoomRoutes);
app.use("/user", userRoutes);
app.use("/company", companyRoutes);
app.use("/job", jobRoutes);

// Add health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date(),
    services: {
      database: 'connected',
      server: 'running'
    }
  });
});

// CORS error handler
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    res.status(403).json({
      success: false,
      message: 'CORS origin not allowed',
    });
  } else {
    next(err);
  }
});

// General error handler (must be after routes)
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Add this at the end
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`🌐Server is running on port ${PORT}`)
);
