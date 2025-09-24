import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `${process.env.DATABASE_CONNECTION_URL}`
    );

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❎ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
