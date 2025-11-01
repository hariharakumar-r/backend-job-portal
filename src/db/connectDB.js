import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Ensure MONGO_URI environment variable is set correctly
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(mongoURI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};
