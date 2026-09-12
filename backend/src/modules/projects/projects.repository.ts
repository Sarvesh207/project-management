import prisma from "../../db/prisma";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema";

async function findAllProjects(userId: string) {
  return prisma.projects.findMany({
    where: {
      OR: [
        { owner_id: userId }, // project they own
        {
          project_members: {
            some: {
              user_id: userId,
            }, // Projects they are member of
          },
        },
      ],
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

async function findProjectById(id: string) {
  return prisma.projects.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      owner_id: true,
      status: true,
      created_at: true,
      updated_at: true,
      project_members: {
        select: {
          user_id: true,
          role: true,
        },
      },
    },
  });
}

async function createProject(
  owner_id: string,
  projectData: CreateProjectInput,
) {
  return prisma.projects.create({
    data: {
      ...projectData,
      users: {
        connect: {
          id: owner_id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      created_at: true,
      updated_at: true,
    },
  });
}

async function deleteProject(id: string) {
  return prisma.projects.delete({
    where: {
      id,
    },
  });
}

async function updateProject(id: string, data: UpdateProjectInput) {
  return prisma.projects.update({
    where: { id },
    data: data,
    select: {
      id: true,
      name: true,
      description: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export {
  findProjectById,
  findAllProjects,
  createProject,
  deleteProject,
  updateProject,
};
