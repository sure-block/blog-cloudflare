import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { CategoriesTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const CategorySelectSchema = createSelectSchema(CategoriesTable, {
  createdAt: coercedDate,
  updatedAt: coercedDate,
});
export const CategoryInsertSchema = createInsertSchema(CategoriesTable);
export const CategoryUpdateSchema = createUpdateSchema(CategoriesTable);

export const CategoryWithCountSchema = CategorySelectSchema.extend({
  postCount: z.number(),
});

// ==================== API Input Schemas ====================
export const CreateCategoryInputSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  sort: z.number().int().optional(),
});

export const UpdateCategoryInputSchema = z.object({
  id: z.number(),
  data: z.object({
    name: z.string().min(1).max(50).optional(),
    slug: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    sort: z.number().int().optional(),
  }),
});

export const DeleteCategoryInputSchema = z.object({
  id: z.number(),
});

export const GetCategoriesInputSchema = z.object({
  sortBy: z.enum(["name", "createdAt", "sort", "postCount"]).optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  withCount: z.boolean().optional(),
  publicOnly: z.boolean().optional(),
});

// ==================== Types ====================
export type Category = typeof CategoriesTable.$inferSelect;
export type CategoryWithCount = z.infer<typeof CategoryWithCountSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInputSchema>;
export type DeleteCategoryInput = z.infer<typeof DeleteCategoryInputSchema>;
export type GetCategoriesInput = z.infer<typeof GetCategoriesInputSchema>;
