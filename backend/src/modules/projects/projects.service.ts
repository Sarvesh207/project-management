import type { RawCreateParams } from "zod/v3";
import { ApiError } from "../../utils";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import {
  findAllProjects,
  findProjectById,
  createProject as createProjectRepository,
  updateProject as updateprojectRepository,
  deleteProject as deleteProjectRepository,
} from "./projects.repository";

async function getAllproject(userId: string) {
  const projects = await findAllProjects(userId);

  if (!projects) {
    throw new ApiError(401, "Projects not found");
  }

  return projects;
}

async function getProjectById(projectId: string, userId: string) {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(401, "Project not found");
  }

  const isOwner = project.owner_id === userId;
  const isMember = project.project_members.some(
    (member) => member.user_id === userId,
  );

  if (!isOwner && !isMember) {
    throw new ApiError(403, "Forbidden: You do not have access this project");
  }

  // Remove project_members before returning the data to the client
  const { project_members, ...projectWithoutMembers } = project;
  return projectWithoutMembers;
}

async function createProject(owner_id: string, data: CreateProjectInput) {
  // Call the repository to save the data
  const newProject = await createProjectRepository(owner_id, data);
  return newProject;
}

async function updateProject(
  projectId: string,
  reqUserId: string,
  data: UpdateProjectInput,
) {
  // ask dp for project
  const project = await getProjectById(projectId, reqUserId);

  if (project.owner_id !== reqUserId) {
    throw new ApiError(
      403,
      "Forbidden: you do not have permission to update this project",
    );
  }

  return updateprojectRepository(projectId, data);
}

async function deleteProject(projectId: string, userId: string) {
  const existingProject = await getProjectById(projectId, userId);

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  if (existingProject.owner_id !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  return deleteProjectRepository(projectId);
}
export {
  getAllproject as getAllProjectService,
  getProjectById as getProjectByIdService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  createProject as createProjectService,
};
