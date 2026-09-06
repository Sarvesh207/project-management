import { findAllUsers, findUser } from "./users.repository";
import { ApiError } from "../../utils";
import { z } from "zod";

const userIdSchema = z.uuid();

export async function getAllUsers() {
  const users = await findAllUsers();

  if (!users) {
    throw new ApiError(404, "Users not found.");
  }

  return users;
}

export async function getUser(id: string) {
  const result = userIdSchema.safeParse(id);

  if (!result.success) {
    throw new ApiError(400, "Invalid user ID.");
  }
  const user = await findUser(id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
}
