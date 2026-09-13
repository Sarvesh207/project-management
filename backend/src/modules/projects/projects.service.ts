import type { RawCreateParams } from "zod/v3";
import { ApiError } from "../../utils";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import {
  findAllProjects,
  findProjectById,
  createProject as createProjectRepository,
  updateProject as updateprojectRepository,
  deleteProject as deleteProjectRepository,
  addMemberToProject,
  updateProjectMemberRole,
  removeMemberFromProject,
  getProjectMember,
  getProjectMembers,
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

async function getProjectMembersService(projectId: string, reqUserId: string) {
  // 1. Fetch raw project
  const project = await findProjectById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // 2. AUTHORIZATION CHECK: Is requester owner or member?
  const isOwner = project.owner_id === reqUserId;
  const isMember = project.project_members.some((m) => m.user_id === reqUserId);

  if (!isOwner && !isMember) {
    throw new ApiError(
      403,
      "Forbidden: You do not have access to view this project's members",
    );
  }

  // 3. Fetch all members
  return await getProjectMembers(projectId);
}

async function getProjectMemberService(
  projectId: string,
  reqUserId: string,
  userId: string,
) {
  // 1. Fetch raw project
  const project = await findProjectById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // 2. AUTHORIZATION CHECK: Is requester owner or member?
  const isOwner = project.owner_id === reqUserId;
  const isMember = project.project_members.some((m) => m.user_id === reqUserId);

  if (!isOwner && !isMember) {
    throw new ApiError(
      403,
      "Forbidden: You do not have access to view this project",
    );
  }

  // 3. Fetch member
  const member = await getProjectMember(projectId, userId);
  if (!member) throw new ApiError(404, "Member not found in this project");

  return member;
}

async function addMemberService(
  projectId: string,
  reqUserId: string,
  userId: string, // target user id
  role: "admin" | "member",
) {
  // find project;
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // AUTHORIZATION CHECK : is requester owner or admin
  const isOwner = project.owner_id === reqUserId;
  const requesterMembership = project.project_members.find(
    (member) => member.user_id === reqUserId,
  );

  const isAdmin = requesterMembership?.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "Forbidden : only owner & admins can add members");
  }

  // check is member is already a part of project

  const existingMember = await getProjectMember(projectId, userId);

  if (existingMember) {
    throw new ApiError(409, "User is already member of project");
  }

  // add member

  return addMemberToProject(projectId, userId, role);
}

async function updateMemberService(
  projectId: string,
  reqUserId: string,
  userId: string,
  role: "admin" | "member",
) {
  // find project;
  const project = await findProjectById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  // 2. AUTHORIZATION CHECK: Is requester owner or admin?
  const isOwner = project.owner_id === reqUserId;
  const requesterMembership = project.project_members.find(
    (m) => m.user_id === reqUserId,
  );
  const isAdmin = requesterMembership?.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,
      "Forbidden: Only owners and admins can update member roles",
    );
  }

  // 3. BUSINESS LOGIC: Cannot modify the project owner
  if (project.owner_id === userId) {
    throw new ApiError(400, "Cannot modify the role of the project owner");
  }

  // 4. CONFLICT CHECK: Does the target member exist?
  const existingMember = await getProjectMember(projectId, userId);
  if (!existingMember)
    throw new ApiError(404, "Member not found in this project");

  const updatedMember = await updateProjectMemberRole(projectId, userId, role);

  return updatedMember;
}

async function removeMemberService(
  projectId: string,
  reqUserId: string,
  userId: string,
) {
  const project = await findProjectById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // 2. AUTHORIZATION CHECK: Requester must be owner, admin, OR themselves (leaving project)
  const isOwner = project.owner_id === reqUserId;
  const requesterMembership = project.project_members.find(
    (m) => m.user_id === reqUserId,
  );
  const isAdmin = requesterMembership?.role === "admin";
  const isSelf = reqUserId === userId; // User is leaving the project on their own

  if (!isOwner && !isAdmin && !isSelf) {
    throw new ApiError(
      403,
      "Forbidden: You do not have permission to remove this member",
    );
  }

  // 3. BUSINESS LOGIC: Cannot remove the project owner
  if (project.owner_id === userId) {
    throw new ApiError(400, "Cannot remove the project owner from the project");
  }

  // 4. CONFLICT CHECK: Does the target member exist?
  const existingMember = await getProjectMember(projectId, userId);
  if (!existingMember)
    throw new ApiError(404, "Member not found in this project");

  // 5. Remove the member
  await removeMemberFromProject(projectId, userId);
}

export {
  getAllproject as getAllProjectService,
  getProjectById as getProjectByIdService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  createProject as createProjectService,
  getProjectMemberService,
  getProjectMembersService,
  addMemberService,
  updateMemberService,
  removeMemberService,
};
