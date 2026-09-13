import type { Request, Response } from "express";

import {
  getAllProjectService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  createProjectService,
  getProjectMemberService,
  getProjectMembersService,
  addMemberService,
  updateMemberService,
  removeMemberService,
} from "./projects.service";
import { UUIDSchema } from "../../types/global.types";
import { ApiError, ApiResponse } from "../../utils";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} from "./project.schema";
import prisma from "../../db/prisma";

async function getAllProjects(req: Request, res: Response) {
  const result = UUIDSchema.safeParse({ id: req.userId });

  if (!result.success) {
    throw new ApiError(402, "Invalid Id");
  }

  const projects = await getAllProjectService(result.data.id);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched succfully"));
}

async function getProjectById(req: Request, res: Response) {
  const id = req.params.id;
  const result = UUIDSchema.safeParse({ id });

  if (!result.success) {
    throw new ApiError(402, "Invalid Id");
  }

  const project = await getProjectByIdService(result.data.id, req.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
}
async function createProject(req: Request, res: Response) {
  const result = createProjectSchema.safeParse(req.body);
  const userId = UUIDSchema.safeParse({ id: req.userId });

  if (!userId.success) {
    throw new ApiError(400, "Invalid User id");
  }

  if (!result.success) {
    throw new ApiError(400, "Invalid input data");
  }

  const project = await createProjectService(userId.data.id, result.data);

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
}
async function updateProject(req: Request, res: Response) {
  const result = updateProjectSchema.safeParse(req.body);
  const projectIdParseResult = UUIDSchema.safeParse({ id: req.params.id });
  const reqUserIdResult = UUIDSchema.safeParse({ id: req.userId });

  if (!projectIdParseResult.success) {
    throw new ApiError(400, "Invalid project id");
  }
  if (!result.success) {
    throw new ApiError(400, "Invalid input data");
  }
  if (!reqUserIdResult.success) {
    throw new ApiError(400, "Invalid user id");
  }

  const updatedProject = await updateProjectService(
    projectIdParseResult.data.id,
    reqUserIdResult.data.id,
    result.data,
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProject,
        "project details updated successfully",
      ),
    );
}
async function deleteProject(req: Request, res: Response) {
  const result = UUIDSchema.safeParse({ id: req.params.id });
  const userResult = UUIDSchema.safeParse({ id: req.userId }); // Get user ID

  if (!result.success || !userResult.success) {
    throw new ApiError(400, "Invalid id");
  }

  await deleteProjectService(result.data.id, userResult.data.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
}
async function getProjectStats(req: Request, res: Response) {}

async function getProjectMembers(req: Request, res: Response) {
  const projectIdParseResult = UUIDSchema.safeParse({
    id: req.params.projectId,
  });
  const reqUserIdResult = UUIDSchema.safeParse({ id: req.userId });

  if (!projectIdParseResult.success || !reqUserIdResult.success) {
    throw new ApiError(400, "Invalid ID");
  }

  const members = await getProjectMembersService(
    projectIdParseResult.data.id,
    reqUserIdResult.data.id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, members, "Project members fetched successfully"),
    );
}

async function getProjectMember(req: Request, res: Response) {
  const projectIdParseResult = UUIDSchema.safeParse({
    id: req.params.projectId,
  });
  const reqUserIdResult = UUIDSchema.safeParse({ id: req.userId });
  const userIdParseResult = UUIDSchema.safeParse({ id: req.params.userId });

  if (
    !projectIdParseResult.success ||
    !reqUserIdResult.success ||
    !userIdParseResult.success
  ) {
    throw new ApiError(400, "Invalid ID");
  }

  const member = await getProjectMemberService(
    projectIdParseResult.data.id,
    reqUserIdResult.data.id,
    userIdParseResult.data.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, member, "Project member fetched successfully"));
}

async function addProjectMember(req: Request, res: Response) {
  const projectIdParseResult = UUIDSchema.safeParse({
    id: req.params.projectId,
  });
  const reqUserIdResult = UUIDSchema.safeParse({ id: req.userId });
  const bodyResult = addMemberSchema.safeParse(req.body);

  if (!projectIdParseResult.success || !reqUserIdResult.success) {
    throw new ApiError(400, "Invalid ID");
  }

  if (!bodyResult.success) {
    throw new ApiError(400, "Invalid input data");
  }

  const newMember = await addMemberService(
    projectIdParseResult.data.id,
    reqUserIdResult.data.id,
    bodyResult.data.user_id,
    bodyResult.data.role,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, newMember, "Project member added successfully"));
}

async function updateProjectMemberRole(req: Request, res: Response) {
  const projectIdParseResult = UUIDSchema.safeParse({
    id: req.params.projectId,
  });
  const reqUserIdResult = UUIDSchema.safeParse({ id: req.userId });
  const userIdParseResult = UUIDSchema.safeParse({ id: req.params.userId });
  const bodyResult = updateMemberRoleSchema.safeParse(req.body);

  if (
    !projectIdParseResult.success ||
    !reqUserIdResult.success ||
    !userIdParseResult.success
  ) {
    throw new ApiError(400, "Invalid ID");
  }

  if (!bodyResult.success) {
    throw new ApiError(400, "Invalid input data");
  }

  const updatedMember = await updateMemberService(
    projectIdParseResult.data.id,
    reqUserIdResult.data.id,
    userIdParseResult.data.id,
    bodyResult.data.role,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedMember,
        "Project member role updated successfully",
      ),
    );
}

async function removeProjectMember(req: Request, res: Response) {
  const projectIdParseResult = UUIDSchema.safeParse({
    id: req.params.projectId,
  });
  const reqUserIdResult = UUIDSchema.safeParse({ id: req.userId });
  const userIdParseResult = UUIDSchema.safeParse({ id: req.params.userId });

  if (
    !projectIdParseResult.success ||
    !reqUserIdResult.success ||
    !userIdParseResult.success
  ) {
    throw new ApiError(400, "Invalid ID");
  }

  await removeMemberService(
    projectIdParseResult.data.id,
    reqUserIdResult.data.id,
    userIdParseResult.data.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project member removed successfully"));
}

export {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
  updateProject,
  getProjectStats,
  getProjectMembers,
  getProjectMember,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
};
