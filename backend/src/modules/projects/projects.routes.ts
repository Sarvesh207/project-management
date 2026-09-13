import { Router } from "express";
import { requireAuth } from "../../middleware";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectStats,
  updateProject,
  getProjectMembers,
  getProjectMember,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} from "./projects.controller";

const router = Router();

router.get("/", requireAuth, getAllProjects);
router.get("/:id", requireAuth, getProjectById);
router.post("/", requireAuth, createProject);
router.patch("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);
// router.get("/:id/stats", requireAuth, getProjectStats);

// project members routes
router.get("/:projectId/members", requireAuth, getProjectMembers);
router.get("/:projectId/members/:userId", requireAuth, getProjectMember);
router.post("/:projectId/members", requireAuth, addProjectMember);
router.put("/:projectId/members/:userId", requireAuth, updateProjectMemberRole);
router.delete("/:projectId/members/:userId", requireAuth, removeProjectMember);



// projects tasks

router.get("/:projectId/tasks", requireAuth, () => {}); // get all  tasks associated with project
router.get("/:projectId/tasks/:tasksId", requireAuth, () => {}); // get specific tasks
router.post("/:projectId/tasks", requireAuth, () => {}); // create tasks in project
router.put("/:projectId/tasks/:tasksId", requireAuth, () => {}); // update tasks
router.delete("/:projectId/tasks/:tasksId", requireAuth, () => {}); // delete tasks

export default router;
