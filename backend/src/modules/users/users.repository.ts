import prisma from "../../db/prisma";

export async function findAllUsers() {
  const users = prisma.users.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return users;
}
export async function findUser(id: string) {
  return prisma.users.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });
}
export async function deleteUser() {}
export async function updateUser() {}
