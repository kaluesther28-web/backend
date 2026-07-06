import mongoose from "mongoose";
import { env } from "./env.config.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    logger.info("Connecting to MongoDB Atlas...");
    await mongoose.connect(env.MONGODB_URI, {
      dbName: "gowell",
    });
    logger.info("MongoDB Atlas Connected!");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
