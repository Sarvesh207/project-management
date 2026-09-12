import { Router } from "express";
import { requireAuth } from "../../middleware";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectStats,
  updateProject,
} from "./projects.controller";

const router = Router();

router.get("/", requireAuth, getAllProjects);
router.get("/:id", requireAuth, getProjectById);
router.post("/", requireAuth, createProject);
router.patch("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);
// router.get("/:id/stats", requireAuth, getProjectStats);
export default router;
