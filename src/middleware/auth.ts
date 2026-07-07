import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/token.js";
import asyncWrapper from "./asyncWrapper.js";
import { ApiError } from "../utils/responseHandler.js";

// Authenticate any logged-in user
export const isAuth = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No Token Provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token as string);

    req.user = payload;
    next();
  }
);

// Only allow users with role 'user'
export const isUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No Token Provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token as string);

    if (!payload.roles?.includes("user")) {
      throw ApiError.forbidden("Access denied — users only");
    }

    req.user = payload;
    next();
  }
);

// Only allow users with role 'provider'
export const isProvider = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No Token Provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token as string);

    

    if (!payload.roles?.includes("provider")) {
      throw ApiError.forbidden("Access denied — providers only");
    }

    req.user = payload;
    next();
  }
);

// Only allow users with role 'admin'
export const isAdmin = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No Token Provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token as string);

    if (!payload.roles?.includes("admin")) {
      throw ApiError.forbidden("Access denied — admins only");
    }

    req.user = payload;
    next();
  }
);
