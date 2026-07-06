import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { MongoError } from "mongodb";
import { env } from "../config/env.config.js";
import logger from "../utils/logger.js";

interface MongoDuplicateKeyError extends MongoError {
  keyValue?: Record<string, string>;
}

export const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (env.NODE_ENV !== "production") {
    logger.fatal(err.message);
  }

  let status_code = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let status = err.status || "Error";

  const { code, keyValue } = err as MongoDuplicateKeyError;

  if (code === 11000 && keyValue) {
    status_code = 409;
    if (keyValue.email) {
      message = "User with this email already exists";
    } else if (keyValue.phoneNumber) {
      message = "User with this phone number already exists";
    }
  }

  return void res.status(status_code).json({
    success: false,
    status,
    status_code,
    message,
    stack: env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
