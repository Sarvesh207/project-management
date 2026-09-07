import {
  findAllUsers,
  findUser,
  updateUser as updateUserRepository,
} from "./users.repository";
import { ApiError } from "../../utils";
import { z } from "zod";
import type { UpdateUserInput } from "./users.schema";

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

export async function updateUser(id: string, data: UpdateUserInput) {

  const existingUser = await findUser(id);

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  return updateUserRepository(id, data);
}
