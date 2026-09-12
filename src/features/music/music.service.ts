import * as MusicRepo from "@/features/music/data/music.data";
import type {
  CreateMusicInput,
  DeleteMusicInput,
  GetMusicInput,
  UpdateMusicInput,
} from "@/features/music/music.schema";
import { err, ok } from "@/lib/errors";

/**
 * Get music list
 */
export async function getMusic(context: DbContext, data: GetMusicInput = {}) {
  const { type, limit } = data;
  return await MusicRepo.getAllMusic(context.db, { type, limit });
}

/**
 * Create music
 */
export async function createMusic(
  context: DbContext,
  data: CreateMusicInput,
) {
  const music = await MusicRepo.insertMusic(context.db, {
    title: data.title,
    artist: data.artist ?? "",
    cover: data.cover ?? "",
    src: data.src,
    lrc: data.lrc ?? "",
    lrcSrc: data.lrcSrc ?? "",
    type: data.type ?? "local",
    sort: data.sort ?? 0,
  });
  return ok(music);
}

/**
 * Update music
 */
export async function updateMusic(
  context: DbContext,
  data: UpdateMusicInput,
) {
  const existing = await MusicRepo.findMusicById(context.db, data.id);
  if (!existing) {
    return err({ reason: "MUSIC_NOT_FOUND" });
  }
  const music = await MusicRepo.updateMusic(context.db, data.id, data.data);
  return ok(music);
}

/**
 * Delete music
 */
export async function deleteMusic(
  context: DbContext,
  data: DeleteMusicInput,
) {
  const existing = await MusicRepo.findMusicById(context.db, data.id);
  if (!existing) {
    return err({ reason: "MUSIC_NOT_FOUND" });
  }
  await MusicRepo.deleteMusic(context.db, data.id);
  return ok({ success: true });
}
