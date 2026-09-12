import * as AlbumRepo from "@/features/albums/data/albums.data";
import type {
  AddPhotoInput,
  CreateAlbumInput,
  DeleteAlbumInput,
  DeletePhotoInput,
  GetAlbumsInput,
  UpdateAlbumInput,
} from "@/features/albums/albums.schema";
import { err, ok } from "@/lib/errors";

/**
 * Get albums
 */
export async function getAlbums(context: DbContext, data: GetAlbumsInput = {}) {
  const { withPhotos, limit } = data;
  return await AlbumRepo.getAllAlbums(context.db, { withPhotos, limit });
}

/**
 * Get album detail with photos
 */
export async function getAlbum(context: DbContext, id: number) {
  const album = await AlbumRepo.findAlbumById(context.db, id);
  if (!album) {
    return err({ reason: "ALBUM_NOT_FOUND" });
  }
  return ok(album);
}

/**
 * Create an album
 */
export async function createAlbum(
  context: DbContext,
  data: CreateAlbumInput,
) {
  const album = await AlbumRepo.insertAlbum(context.db, {
    title: data.title,
    description: data.description ?? "",
    cover: data.cover ?? "",
    sort: data.sort ?? 0,
  });
  return ok(album);
}

/**
 * Update an album
 */
export async function updateAlbum(
  context: DbContext,
  data: UpdateAlbumInput,
) {
  const existing = await AlbumRepo.findAlbumById(context.db, data.id);
  if (!existing) {
    return err({ reason: "ALBUM_NOT_FOUND" });
  }
  const album = await AlbumRepo.updateAlbum(context.db, data.id, data.data);
  return ok(album);
}

/**
 * Delete an album
 */
export async function deleteAlbum(
  context: DbContext,
  data: DeleteAlbumInput,
) {
  const existing = await AlbumRepo.findAlbumById(context.db, data.id);
  if (!existing) {
    return err({ reason: "ALBUM_NOT_FOUND" });
  }
  await AlbumRepo.deleteAlbum(context.db, data.id);
  return ok({ success: true });
}

/**
 * Add a photo to an album
 */
export async function addPhoto(context: DbContext, data: AddPhotoInput) {
  const album = await AlbumRepo.findAlbumById(context.db, data.albumId);
  if (!album) {
    return err({ reason: "ALBUM_NOT_FOUND" });
  }
  const photo = await AlbumRepo.insertPhoto(context.db, {
    albumId: data.albumId,
    url: data.url,
    caption: data.caption ?? "",
    orientation: data.orientation ?? "landscape",
    sort: data.sort ?? 0,
  });
  return ok(photo);
}

/**
 * Delete a photo
 */
export async function deletePhoto(context: DbContext, data: DeletePhotoInput) {
  await AlbumRepo.deletePhoto(context.db, data.id);
  return ok({ success: true });
}
