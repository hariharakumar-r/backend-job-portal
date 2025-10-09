import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_CONNECTION_URL) {
      console.error("❎ DATABASE_CONNECTION_URL is not set. Did you configure environment variables?");
      // don't throw here so the caller can decide; still attempt to connect will fail and be caught below
    }

    await mongoose.connect(process.env.DATABASE_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    // Log the full error (stack when available) to help debugging on remote hosts
    console.error("❎ Database connection failed:", error && error.stack ? error.stack : error);
    // In many hosting/serverless environments exiting the process is undesirable during build/runtime,
    // but keep behavior for local development. On platforms like Vercel you should rely on logs and redeploy.
    if (process.env.NODE_ENV === "development") {
      process.exit(1);
    }
  }
};

export default connectDB;
