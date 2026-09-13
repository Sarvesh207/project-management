import z from "zod";
import { string } from "zod/v3";

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().trim().optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
});

const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .optional(),

    description: z.string().trim().optional(),

    status: z.enum(["active", "completed", "archived"]).optional(),
  })
  .strict();

const addMemberSchema = z.object({
  user_id: z.string().uuid("Invalid User ID"),
  role: z.enum(["admin", "member"]).default("member"),
});

const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"]),
});

const createTasksSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at lease 2 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z.string().trim().optional(),
  status: z.enum(["completed", "pending", "in_progress"]).optional(),
  priority: z.number().int().min(1).max(5).optional(),
  due_date: z
    .string()
    .date()
    .transform((value) => new Date(`${value}T00:00:00Z`))
    .optional(),
  assigned_to: z.uuid().nullable(),
});

const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be at most 100 characters")
      .optional(),

    description: z.string().trim().nullable().optional(),

    status: z.enum(["completed", "pending", "in_progress"]).optional(),

    priority: z.number().int().min(1).max(5).optional(),

    due_date: z
      .string()
      .date()
      .transform((value) => new Date(`${value}T00:00:00Z`))
      .nullable()
      .optional(),

    assigned_to: z.uuid().nullable().optional(),
  })
  .strict();

const taskParamsSchema = z.object({
  projectId: z.uuid(),
  taskId: z.uuid(),
});

type TaskParams = z.infer<typeof taskParamsSchema>;
type CreateProjectInput = z.infer<typeof createProjectSchema>;
type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
type addMemberInput = z.infer<typeof addMemberSchema>;
type updateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
type createTaskInput = z.infer<typeof createTasksSchema>;
type updateTaskInput = z.infer<typeof updateTaskSchema>;

export {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  createTasksSchema,
  updateTaskSchema,
  taskParamsSchema,
};

export type {
  CreateProjectInput,
  UpdateProjectInput,
  addMemberInput,
  updateMemberRoleInput,
  createTaskInput,
  updateTaskInput,
  TaskParams,
};
