import { createServerFn } from "@tanstack/react-start";
import * as AlbumService from "@/features/albums/albums.service";
import {
  AddPhotoInputSchema,
  CreateAlbumInputSchema,
  DeleteAlbumInputSchema,
  DeletePhotoInputSchema,
  GetAlbumsInputSchema,
  UpdateAlbumInputSchema,
} from "@/features/albums/albums.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

// ============ Public API ============

/** 公开：相册列表 */
export const getAlbumsFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetAlbumsInputSchema)
  .handler(async ({ data, context }) => {
    return await AlbumService.getAlbums(context, data);
  });

// ============ Admin API ============

/** 管理端：创建相册 */
export const createAlbumFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateAlbumInputSchema)
  .handler(({ data, context }) => AlbumService.createAlbum(context, data));

/** 管理端：更新相册 */
export const updateAlbumFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateAlbumInputSchema)
  .handler(({ data, context }) => AlbumService.updateAlbum(context, data));

/** 管理端：删除相册 */
export const deleteAlbumFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteAlbumInputSchema)
  .handler(({ data, context }) => AlbumService.deleteAlbum(context, data));

/** 管理端：添加照片 */
export const addPhotoFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(AddPhotoInputSchema)
  .handler(({ data, context }) => AlbumService.addPhoto(context, data));

/** 管理端：删除照片 */
export const deletePhotoFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeletePhotoInputSchema)
  .handler(({ data, context }) => AlbumService.deletePhoto(context, data));
