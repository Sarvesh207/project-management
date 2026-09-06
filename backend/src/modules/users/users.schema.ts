import { z } from "zod";
import { optional } from "zod/v3";

export const userIdSchema = z.object({
  id: z.uuid(),
});

export const updateUserSchema = z.object({
  email: z.email().optional(),
  full_name: z.string().min(2).max(100).optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
