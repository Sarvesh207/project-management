import prisma from "../../db/prisma";
import { prismaVersion } from "../../generated/prisma/internal/prismaNamespace";
import type { UserRegisterInput, UserLoginInput } from "./auth.schema";
import type { createUserRepo } from "./auth.types";

export async function findUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: { email },
  });
}

export async function createUser(data: createUserRepo) {
  return prisma.users.create({
    data,
    select: {
      id: true,
      email: true,
      full_name: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export async function findUserById(id: string) {
  return prisma.users.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      full_name: true,
      created_at: true,
      updated_at: true,
      profile: true,
    },
  });
}
