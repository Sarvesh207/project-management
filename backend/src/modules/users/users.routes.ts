import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./users.controller";
import { userIdSchema } from "./users.schema";
const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);

export default router;
