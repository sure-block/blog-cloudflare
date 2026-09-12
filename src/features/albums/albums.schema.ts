import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { AlbumsTable, PhotosTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const AlbumSelectSchema = createSelectSchema(AlbumsTable, {
  createdAt: coercedDate,
  updatedAt: coercedDate,
});
export const AlbumInsertSchema = createInsertSchema(AlbumsTable);
export const AlbumUpdateSchema = createUpdateSchema(AlbumsTable);

export const PhotoSelectSchema = createSelectSchema(PhotosTable, {
  createdAt: coercedDate,
});
export const PhotoInsertSchema = createInsertSchema(PhotosTable);

export const AlbumWithPhotosSchema = AlbumSelectSchema.extend({
  photos: z.array(PhotoSelectSchema).optional(),
});

// ==================== API Input Schemas ====================
export const CreateAlbumInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  cover: z.string().max(500).optional(),
  sort: z.number().int().optional(),
});

export const UpdateAlbumInputSchema = z.object({
  id: z.number(),
  data: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    cover: z.string().max(500).optional(),
    sort: z.number().int().optional(),
  }),
});

export const DeleteAlbumInputSchema = z.object({
  id: z.number(),
});

export const GetAlbumsInputSchema = z.object({
  withPhotos: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const AddPhotoInputSchema = z.object({
  albumId: z.number(),
  url: z.string().min(1).max(1000),
  caption: z.string().max(500).optional(),
  orientation: z.enum(["landscape", "portrait"]).optional(),
  sort: z.number().int().optional(),
});

export const DeletePhotoInputSchema = z.object({
  id: z.number(),
});

// ==================== Types ====================
export type Album = typeof AlbumsTable.$inferSelect;
export type Photo = typeof PhotosTable.$inferSelect;
export type AlbumWithPhotos = z.infer<typeof AlbumWithPhotosSchema>;
export type CreateAlbumInput = z.infer<typeof CreateAlbumInputSchema>;
export type UpdateAlbumInput = z.infer<typeof UpdateAlbumInputSchema>;
export type DeleteAlbumInput = z.infer<typeof DeleteAlbumInputSchema>;
export type GetAlbumsInput = z.infer<typeof GetAlbumsInputSchema>;
export type AddPhotoInput = z.infer<typeof AddPhotoInputSchema>;
export type DeletePhotoInput = z.infer<typeof DeletePhotoInputSchema>;
