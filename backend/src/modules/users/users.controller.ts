import type { Response, Request } from "express";
import {
  getAllUsers as getAllUsersService,
  getUser as getUserService,
} from "./users.service";
import { ApiResponse, ApiError } from "../../utils";

export async function getAllUsers(req: Request, res: Response) {
  const users = await getAllUsersService();

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
}

export async function getUserById(req: Request, res: Response) {
  const userid = req.params.id;

  if (typeof userid !== "string") {
    throw new ApiError(400, "Invalid user id");
  }
  const user = await getUserService(userid);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
}
