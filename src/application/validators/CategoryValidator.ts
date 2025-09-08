import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});
