import z from "zod";
import type { UserRegisterInput, UserLoginInput } from "./auth.schema";
import { ApiError } from "../../utils";
import { findUserByEmail, createUser } from "./auth.repository";
import { comparePassword, hashPassword } from "../../utils/password";
import { da } from "zod/v4/locales";
import { get } from "node:http";
import { generateAccessToken } from "../../utils/jwt";

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

export async function loginUserService(data: UserLoginInput) {
  const user = await getUserByEmail(data.email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.password_hash,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken: accessToken,
    user: {
      id: user.id,
      email: user.email,
      fullname: user.full_name,
    },
  };
}
