import type { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path[0],
          message:
            err.code === "unrecognized_keys"
              ? `Unrecognized key(s): ${err.keys?.join(", ")}`
              : err.message,
        }));

        return void res.status(422).json({
          success: false,
          status: "Validation Error",
          status_code: 422,
          errors,
        });
      }
      return next(error);
    }
  };

export const validateParams =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path[0],
          message:
            err.code === "unrecognized_keys"
              ? `Unrecognized key(s): ${err.keys?.join(", ")}`
              : err.message,
        }));

        return void res.status(400).json({
          success: false,
          status: "Invalid Params",
          status_code: 400,
          errors,
        });
      }
      return next(error);
    }
  };

export const validateQuery =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path[0],
          message:
            err.code === "unrecognized_keys"
              ? `Unrecognized key(s): ${err.keys?.join(", ")}`
              : err.message,
        }));

        return void res.status(400).json({
          success: false,
          status: "Invalid Query Parameters",
          status_code: 400,
          errors,
        });
      }
      return next(error);
    }
  };
