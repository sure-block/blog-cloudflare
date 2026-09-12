import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { MusicTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const MusicSelectSchema = createSelectSchema(MusicTable, {
  createdAt: coercedDate,
  updatedAt: coercedDate,
});
export const MusicInsertSchema = createInsertSchema(MusicTable);
export const MusicUpdateSchema = createUpdateSchema(MusicTable);

// ==================== API Input Schemas ====================
export const CreateMusicInputSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().max(200).optional(),
  cover: z.string().max(500).optional(),
  src: z.string().min(1).max(1000),
  lrc: z.string().max(10000).optional(),
  lrcSrc: z.string().max(1000).optional(),
  type: z.enum(["local", "netease"]).optional(),
  sort: z.number().int().optional(),
});

export const UpdateMusicInputSchema = z.object({
  id: z.number(),
  data: z.object({
    title: z.string().min(1).max(200).optional(),
    artist: z.string().max(200).optional(),
    cover: z.string().max(500).optional(),
    src: z.string().min(1).max(1000).optional(),
    lrc: z.string().max(10000).optional(),
    lrcSrc: z.string().max(1000).optional(),
    type: z.enum(["local", "netease"]).optional(),
    sort: z.number().int().optional(),
  }),
});

export const DeleteMusicInputSchema = z.object({
  id: z.number(),
});

export const GetMusicInputSchema = z.object({
  type: z.enum(["local", "netease"]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// ==================== Types ====================
export type Music = typeof MusicTable.$inferSelect;
export type CreateMusicInput = z.infer<typeof CreateMusicInputSchema>;
export type UpdateMusicInput = z.infer<typeof UpdateMusicInputSchema>;
export type DeleteMusicInput = z.infer<typeof DeleteMusicInputSchema>;
export type GetMusicInput = z.infer<typeof GetMusicInputSchema>;
