import { createServerFn } from "@tanstack/react-start";
import * as MusicService from "@/features/music/music.service";
import {
  CreateMusicInputSchema,
  DeleteMusicInputSchema,
  GetMusicInputSchema,
  UpdateMusicInputSchema,
} from "@/features/music/music.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

// ============ Public API ============

/** 公开：音乐列表 */
export const getMusicFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetMusicInputSchema)
  .handler(async ({ data, context }) => {
    return await MusicService.getMusic(context, data);
  });

// ============ Admin API ============

/** 管理端：新增音乐 */
export const createMusicFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateMusicInputSchema)
  .handler(({ data, context }) => MusicService.createMusic(context, data));

/** 管理端：更新音乐 */
export const updateMusicFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateMusicInputSchema)
  .handler(({ data, context }) => MusicService.updateMusic(context, data));

/** 管理端：删除音乐 */
export const deleteMusicFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteMusicInputSchema)
  .handler(({ data, context }) => MusicService.deleteMusic(context, data));
