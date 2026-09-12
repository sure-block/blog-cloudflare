import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { ChattersTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const ChatterSelectSchema = createSelectSchema(ChattersTable, {
  createdAt: coercedDate,
  updatedAt: coercedDate,
});
export const ChatterInsertSchema = createInsertSchema(ChattersTable);
export const ChatterUpdateSchema = createUpdateSchema(ChattersTable);

// ==================== API Input Schemas ====================
export const CreateChatterInputSchema = z.object({
  content: z.string().min(1).max(2000),
  images: z.array(z.string().url()).max(9).optional(),
  mood: z.string().max(50).optional(),
});

export const UpdateChatterInputSchema = z.object({
  id: z.number(),
  data: z.object({
    content: z.string().min(1).max(2000).optional(),
    images: z.array(z.string().url()).max(9).optional(),
    mood: z.string().max(50).optional(),
    status: z.enum(["draft", "published"]).optional(),
  }),
});

export const DeleteChatterInputSchema = z.object({
  id: z.number(),
});

export const GetChattersInputSchema = z.object({
  cursor: z.number().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const LikeChatterInputSchema = z.object({
  id: z.number(),
});

// ==================== Types ====================
export type Chatter = typeof ChattersTable.$inferSelect;
export type CreateChatterInput = z.infer<typeof CreateChatterInputSchema>;
export type UpdateChatterInput = z.infer<typeof UpdateChatterInputSchema>;
export type DeleteChatterInput = z.infer<typeof DeleteChatterInputSchema>;
export type GetChattersInput = z.infer<typeof GetChattersInputSchema>;
export type LikeChatterInput = z.infer<typeof LikeChatterInputSchema>;
