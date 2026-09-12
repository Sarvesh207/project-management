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

type CreateProjectInput = z.infer<typeof createProjectSchema>;
type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export { createProjectSchema, updateProjectSchema };

export type { CreateProjectInput, UpdateProjectInput };
