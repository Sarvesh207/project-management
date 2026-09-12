import type { Request, Response } from "express";

import {
  getAllProjectService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  createProjectService,
} from "./projects.service";
import { UUIDSchema } from "../../types/global.types";
import { ApiError, ApiResponse } from "../../utils";
import { createProjectSchema, updateProjectSchema } from "./project.schema";

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

export {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
  updateProject,
  getProjectStats,
};
