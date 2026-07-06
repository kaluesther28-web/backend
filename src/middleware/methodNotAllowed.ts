import type { Request, Response } from "express";

const methodNotAllowed = (req: Request, res: Response): void => {
  res.status(405).json({
    success: false,
    status: "Method Not Allowed",
    status_code: 405,
    message: `Method ${req.method} is not allowed on ${req.originalUrl}`,
  });
};

export default methodNotAllowed;
