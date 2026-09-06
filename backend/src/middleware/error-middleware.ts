import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      data: err.data,
      errors: err.errors,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal server error",
    data: null,
    errors: [],
  });
};
