import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";
import { z } from "zod";
import { ChatterCommentsTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const ChatterCommentSelectSchema = createSelectSchema(
  ChatterCommentsTable,
  { createdAt: coercedDate },
);
export const ChatterCommentInsertSchema = createInsertSchema(
  ChatterCommentsTable,
);

// ==================== API Input Schemas ====================
export const CreateChatterCommentInputSchema = z.object({
  chatterId: z.number(),
  parentId: z.number().nullable().optional(),
  content: z.string().min(1).max(1000),
  emailUserName: z.string().max(50).optional(),
  emailUserAvatar: z.string().max(500).optional(),
});

export const DeleteChatterCommentInputSchema = z.object({
  id: z.number(),
});

export const GetChatterCommentsInputSchema = z.object({
  chatterId: z.number(),
  cursor: z.number().optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

// ==================== Types ====================
export type ChatterComment = typeof ChatterCommentsTable.$inferSelect;
export type CreateChatterCommentInput = z.infer<
  typeof CreateChatterCommentInputSchema
>;
export type DeleteChatterCommentInput = z.infer<
  typeof DeleteChatterCommentInputSchema
>;
export type GetChatterCommentsInput = z.infer<
  typeof GetChatterCommentsInputSchema
>;
