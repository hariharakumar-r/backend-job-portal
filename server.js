import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./src/db/connectDB.js";
import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import Cloudinary from "./src/utils/Cloudinary.js";
import authRoutes from "./src/routes/authRoutes.js";
import zoomRoutes from './src/routes/zoom.js';  

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
Cloudinary();

app.get("/", (req, res) => res.send("api is working"));

// Add this error handler before your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
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
