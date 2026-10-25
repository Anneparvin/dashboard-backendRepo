// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorMiddleware(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  if (!(err instanceof ApiError)) {
    console.error("Unexpected Error:", err);
  }

    res.status(statusCode).json({
    success: false,
    message,
    ...(err instanceof ApiError && err.errors ? { errors: err.errors } : {}),
  });
}

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
}