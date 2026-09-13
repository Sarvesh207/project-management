import prisma from "../db/prisma";
import { ApiError } from "./api-error";
import type { member_role } from "../generated/prisma/enums";

export async function requireProjectRole(
  projectId: string,
  userId: string,
  allowedRoles: member_role[],
) {
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
    select: { owner_id: true },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner_id === userId) {
    if (!allowedRoles.includes("owner")) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }
    return { role: "owner" as member_role };
  }

  const member = await prisma.project_members.findUnique({
    where: {
      project_id_user_id: {
        project_id: projectId,
        user_id: userId,
      },
    },
    select: {
      role: true,
    },
  });

  if (!member) {
    throw new ApiError(403, "You are not a member of this project");
  }

  if (!allowedRoles.includes(member.role)) {
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );
  }

  return member;
}
