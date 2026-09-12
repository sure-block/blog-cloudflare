import { createServerFn } from "@tanstack/react-start";
import * as ChatterService from "@/features/chatters/chatters.service";
import {
  CreateChatterInputSchema,
  DeleteChatterInputSchema,
  GetChattersInputSchema,
  LikeChatterInputSchema,
  UpdateChatterInputSchema,
} from "@/features/chatters/chatters.schema";
import {
  CreateChatterCommentInputSchema,
  DeleteChatterCommentInputSchema,
  GetChatterCommentsInputSchema,
} from "@/features/chatters/chatter-comments.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

// ============ Public API ============

/** 公开：说说列表 */
export const getChattersFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetChattersInputSchema)
  .handler(async ({ data, context }) => {
    return await ChatterService.getChatters(context, data);
  });

/** 公开：说说评论列表 */
export const getChatterCommentsFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetChatterCommentsInputSchema)
  .handler(async ({ data, context }) => {
    return await ChatterService.getChatterComments(context, data);
  });

/** 公开：发布说说评论 */
export const createChatterCommentFn = createServerFn({
  method: "POST",
})
  .middleware([dbMiddleware])
  .inputValidator(CreateChatterCommentInputSchema)
  .handler(({ data, context }) =>
    ChatterService.createChatterComment(context, data),
  );

/** 公开：说说点赞 */
export const likeChatterFn = createServerFn({
  method: "POST",
})
  .middleware([dbMiddleware])
  .inputValidator(LikeChatterInputSchema)
  .handler(({ data, context }) => ChatterService.likeChatter(context, data));

// ============ Admin API ============

/** 管理端：全部说说（含草稿） */
export const getAllChattersFn = createServerFn()
  .middleware([adminMiddleware])
  .handler(async ({ context }) => {
    return await ChatterService.getAllChatters(context);
  });

/** 管理端：发布说说 */
export const createChatterFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateChatterInputSchema)
  .handler(({ data, context }) => ChatterService.createChatter(context, data));

/** 管理端：更新说说 */
export const updateChatterFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateChatterInputSchema)
  .handler(({ data, context }) => ChatterService.updateChatter(context, data));

/** 管理端：删除说说 */
export const deleteChatterFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteChatterInputSchema)
  .handler(({ data, context }) => ChatterService.deleteChatter(context, data));

/** 管理端：删除说说评论 */
export const deleteChatterCommentFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteChatterCommentInputSchema)
  .handler(({ data, context }) =>
    ChatterService.deleteChatterComment(context, data),
  );
