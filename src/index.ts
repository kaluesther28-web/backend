import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger.js";
import { env } from "./config/env.config.js";
import connectDB from "./config/connectDB.js";
import notFound from "./middleware/notFound.js";
import { errorMiddleware } from "./middleware/error.js";


// Route imports
import authRoutes     from "./modules/auth/auth.routes.js";
import providerRoutes from "./modules/provider/provider.routes.js";
import requestRoutes from "./modules/request/request.routes.js";
import ratingRoutes from "./modules/rating/rating.routes.js";

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GoWell API is running 🔧",
    version: "1.0.0",
    env:     env.NODE_ENV,
       endpoints: {
      auth:      "/api/v1/auth",
      providers: "/api/v1/providers",
      requests:  "/api/v1/requests",
      ratings:   "/api/v1/ratings",
    },
  });
});

// API routes
app.use("/api/v1/auth",      authRoutes);
app.use("/api/v1/providers", providerRoutes);
app.use("/api/v1/requests",  requestRoutes);
app.use("/api/v1/ratings",   ratingRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      logger.info(`🚀 GoWell server running on PORT ${env.PORT} [${env.NODE_ENV}]`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
