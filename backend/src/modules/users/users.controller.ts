import type { Response, Request } from "express";
import {
  getAllUsers as getAllUsersService,
  getUser as getUserService,
  updateUser as updateUserService,
} from "./users.service";
import { ApiResponse, ApiError } from "../../utils";
import { updateUserSchema } from "./users.schema";

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

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(400, "Invalid user id");
  }

  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "Invalid request data", result.error.issues);
  }

  const user = await updateUserService(id, result.data);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully."));
}
