import { createServerFn } from "@tanstack/react-start";
import * as BookmarkService from "@/features/bookmarks/bookmarks.service";
import {
  CreateBookmarkCategoryInputSchema,
  CreateBookmarkSiteInputSchema,
  DeleteBookmarkCategoryInputSchema,
  DeleteBookmarkSiteInputSchema,
  GetBookmarksInputSchema,
  UpdateBookmarkCategoryInputSchema,
  UpdateBookmarkSiteInputSchema,
} from "@/features/bookmarks/bookmarks.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

// ============ Public API ============

/** 公开：收藏夹（分类+站点） */
export const getBookmarksFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetBookmarksInputSchema)
  .handler(async ({ data, context }) => {
    return await BookmarkService.getBookmarks(context, data);
  });

// ============ Admin API ============

/** 管理端：创建收藏分类 */
export const createBookmarkCategoryFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateBookmarkCategoryInputSchema)
  .handler(({ data, context }) =>
    BookmarkService.createBookmarkCategory(context, data),
  );

/** 管理端：更新收藏分类 */
export const updateBookmarkCategoryFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateBookmarkCategoryInputSchema)
  .handler(({ data, context }) =>
    BookmarkService.updateBookmarkCategory(context, data),
  );

/** 管理端：删除收藏分类 */
export const deleteBookmarkCategoryFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteBookmarkCategoryInputSchema)
  .handler(({ data, context }) =>
    BookmarkService.deleteBookmarkCategory(context, data),
  );

/** 管理端：创建收藏站点 */
export const createBookmarkSiteFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateBookmarkSiteInputSchema)
  .handler(({ data, context }) =>
    BookmarkService.createBookmarkSite(context, data),
  );

/** 管理端：更新收藏站点 */
export const updateBookmarkSiteFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateBookmarkSiteInputSchema)
  .handler(({ data, context }) =>
    BookmarkService.updateBookmarkSite(context, data),
  );

/** 管理端：删除收藏站点 */
export const deleteBookmarkSiteFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteBookmarkSiteInputSchema)
  .handler(({ data, context }) =>
    BookmarkService.deleteBookmarkSite(context, data),
  );
