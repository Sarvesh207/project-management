import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils";

interface JwtPayload {
  sub: string;
  type: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized: no token provided");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.userId = decoded.sub;

    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized: Invalid token");
  }
}
