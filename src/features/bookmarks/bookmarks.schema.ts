import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";
import { z } from "zod";
import { BookmarkCategoriesTable, BookmarkSitesTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const BookmarkCategorySelectSchema = createSelectSchema(
  BookmarkCategoriesTable,
  { createdAt: coercedDate, updatedAt: coercedDate },
);
export const BookmarkCategoryInsertSchema = createInsertSchema(
  BookmarkCategoriesTable,
);

export const BookmarkSiteSelectSchema = createSelectSchema(BookmarkSitesTable, {
  createdAt: coercedDate,
});
export const BookmarkSiteInsertSchema = createInsertSchema(BookmarkSitesTable);

export const BookmarkCategoryWithSitesSchema =
  BookmarkCategorySelectSchema.extend({
    sites: z.array(BookmarkSiteSelectSchema).optional(),
  });

// ==================== API Input Schemas ====================
export const CreateBookmarkCategoryInputSchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  sort: z.number().int().optional(),
});

export const UpdateBookmarkCategoryInputSchema = z.object({
  id: z.number(),
  data: z.object({
    name: z.string().min(1).max(50).optional(),
    icon: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    sort: z.number().int().optional(),
  }),
});

export const DeleteBookmarkCategoryInputSchema = z.object({
  id: z.number(),
});

export const CreateBookmarkSiteInputSchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1).max(100),
  url: z.string().min(1).max(1000),
  icon: z.string().max(500).optional(),
  description: z.string().max(500).optional(),
  platforms: z.array(z.string()).max(20).optional(),
  sort: z.number().int().optional(),
});

export const UpdateBookmarkSiteInputSchema = z.object({
  id: z.number(),
  data: z.object({
    name: z.string().min(1).max(100).optional(),
    url: z.string().min(1).max(1000).optional(),
    icon: z.string().max(500).optional(),
    description: z.string().max(500).optional(),
    platforms: z.array(z.string()).max(20).optional(),
    sort: z.number().int().optional(),
    categoryId: z.number().optional(),
  }),
});

export const DeleteBookmarkSiteInputSchema = z.object({
  id: z.number(),
});

export const GetBookmarksInputSchema = z.object({
  withSites: z.boolean().optional(),
});

// ==================== Types ====================
export type BookmarkCategory = typeof BookmarkCategoriesTable.$inferSelect;
export type BookmarkSite = typeof BookmarkSitesTable.$inferSelect;
export type BookmarkCategoryWithSites = z.infer<
  typeof BookmarkCategoryWithSitesSchema
>;
export type CreateBookmarkCategoryInput = z.infer<
  typeof CreateBookmarkCategoryInputSchema
>;
export type UpdateBookmarkCategoryInput = z.infer<
  typeof UpdateBookmarkCategoryInputSchema
>;
export type DeleteBookmarkCategoryInput = z.infer<
  typeof DeleteBookmarkCategoryInputSchema
>;
export type CreateBookmarkSiteInput = z.infer<
  typeof CreateBookmarkSiteInputSchema
>;
export type UpdateBookmarkSiteInput = z.infer<
  typeof UpdateBookmarkSiteInputSchema
>;
export type DeleteBookmarkSiteInput = z.infer<
  typeof DeleteBookmarkSiteInputSchema
>;
export type GetBookmarksInput = z.infer<typeof GetBookmarksInputSchema>;
