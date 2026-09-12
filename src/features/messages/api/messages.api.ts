import { createServerFn } from "@tanstack/react-start";
import * as MessageService from "@/features/messages/messages.service";
import {
  CreateMessageInputSchema,
  DeleteMessageInputSchema,
  GetMessagesInputSchema,
  UpdateMessageInputSchema,
} from "@/features/messages/messages.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

// ============ Public API ============

/** 公开：留言板列表（含回复） */
export const getMessagesFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetMessagesInputSchema)
  .handler(async ({ data, context }) => {
    return await MessageService.getMessages(context, data);
  });

/** 公开：发布留言 */
export const createMessageFn = createServerFn({
  method: "POST",
})
  .middleware([dbMiddleware])
  .inputValidator(CreateMessageInputSchema)
  .handler(({ data, context }) => MessageService.createMessage(context, data));

// ============ Admin API ============

/** 管理端：全部留言 */
export const getAllMessagesFn = createServerFn()
  .middleware([adminMiddleware])
  .handler(async ({ context }) => {
    return await MessageService.getAllMessages(context);
  });

/** 管理端：审核留言 */
export const updateMessageFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateMessageInputSchema)
  .handler(({ data, context }) => MessageService.updateMessage(context, data));

/** 管理端：删除留言 */
export const deleteMessageFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteMessageInputSchema)
  .handler(({ data, context }) => MessageService.deleteMessage(context, data));
