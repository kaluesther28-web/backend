import type { Request, Response } from "express";

const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    status: "Not Found",
    status_code: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export default notFound;
