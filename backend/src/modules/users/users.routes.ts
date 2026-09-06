import { Router } from "express";
import { getAllUsers, getUserById } from "./users.controller";
import { userIdSchema } from "./users.schema";
const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

// router.delete("/:id", getAllUsers);

// router.patch("/:id", getAllUsers);

export default router;
