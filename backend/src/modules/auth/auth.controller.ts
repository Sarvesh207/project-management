import type { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utils";
import { userRegisterSchema, userLoginSchema } from "./auth.schema";

import {
  loginUserService,
  registerUserService,
  getUserById,
} from "./auth.service";

export async function registerUser(req: Request, res: Response) {
  const result = userRegisterSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "Invalid registration data", result.error.issues);
  }

  const user = await registerUserService(result.data);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registred successfully"));
}

export async function loginUser(req: Request, res: Response) {
  const result = userLoginSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "Invalid login data", result.error.issues);
  }

  const { accessToken, user } = await loginUserService(result.data);

  // set http-only cookies

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User login successfully"));
}

export async function logoutUser(req: Request, res: Response) {
  res.clearCookie("accessToken");

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
}

export async function getCurrentUser(req: Request, res: Response) {
  const user = await getUserById(req.userId as string);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
}
