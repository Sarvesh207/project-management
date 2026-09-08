import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { handlePrismaError } from "../utils/prisma-error";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Prisma errors
  const prismaError = handlePrismaError(err);

  if (prismaError) {
    return res.status(prismaError.statusCode).json({
      success: prismaError.success,
      statusCode: prismaError.statusCode,
      message: prismaError.message,
      data: prismaError.data,
      errors: prismaError.errors,
    });
  }

  // Our application errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      data: err.data,
      errors: err.errors,
    });
  }

  // Unknown errors


  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal server error",
    data: null,
    errors: [],
  });
};
