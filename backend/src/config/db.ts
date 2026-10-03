import mongoose from "mongoose";
import env from "./env";

export const connectDatabase = async (): Promise<void> => {
  if (!env.mongodbUri) {
    console.warn(
      "MONGODB_URI is not configured. Starting server without database connection."
    );
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    process.exit(1);
  }
};