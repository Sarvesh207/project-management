import z from "zod";
import type { UserRegisterInput, UserLoginInput } from "./auth.schema";
import { ApiError } from "../../utils";
import { findUserByEmail, createUser } from "./auth.repository";
import { hashPassword } from "../../utils/password";
import { da } from "zod/v4/locales";

async function getUserByEmail(email: string) {
  return findUserByEmail(email);
}

export async function registerUserService(data: UserRegisterInput) {
  const existingUser = await getUserByEmail(data.email);

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await createUser({
    email: data.email,
    full_name: data.full_name,
    password_hash: passwordHash,
  });

  return user;
}
