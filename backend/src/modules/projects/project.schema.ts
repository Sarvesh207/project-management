import z from "zod";

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

type CreateProjectInput = z.infer<typeof createProjectSchema>;
type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
type addMemberInput = z.infer<typeof addMemberSchema>;
type updateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

export {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
};

export type {
  CreateProjectInput,
  UpdateProjectInput,
  addMemberInput,
  updateMemberRoleInput,
};
