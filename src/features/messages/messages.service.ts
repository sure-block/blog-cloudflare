import * as MessageRepo from "@/features/messages/data/messages.data";
import type {
  CreateMessageInput,
  DeleteMessageInput,
  GetMessagesInput,
  UpdateMessageInput,
} from "@/features/messages/messages.schema";
import { err, ok } from "@/lib/errors";

/**
 * Get approved guestbook messages with replies
 */
export async function getMessages(
  context: DbContext,
  data: GetMessagesInput = {},
) {
  const { cursor, limit } = data;
  const { items, nextCursor } = await MessageRepo.getApprovedMessages(
    context.db,
    { cursor, limit },
  );

  const rootIds = items.map((m) => m.id);
  const replies = await MessageRepo.getRepliesByMessageIds(context.db, rootIds);

  return {
    items: items.map((root) => ({
      ...root,
      replies: replies.filter((r) => r.parentId === root.id),
    })),
    nextCursor,
  };
}

/**
 * Get all messages (admin)
 */
export async function getAllMessages(
  context: DbContext,
  data: { offset?: number; limit?: number; status?: "pending" | "approved" | "rejected" } = {},
) {
  return await MessageRepo.getAllMessages(context.db, data);
}

/**
 * Post a guestbook message
 */
export async function createMessage(
  context: DbContext,
  data: CreateMessageInput,
) {
  const message = await MessageRepo.insertMessage(context.db, {
    content: data.content,
    parentId: data.parentId ?? null,
    emailUserName: data.emailUserName ?? "",
    emailUserAvatar: data.emailUserAvatar ?? "",
    status: "approved",
    ip: "",
  });
  return ok(message);
}

/**
 * Update message status (admin moderation)
 */
export async function updateMessage(
  context: DbContext,
  data: UpdateMessageInput,
) {
  const existing = await MessageRepo.findMessageById(context.db, data.id);
  if (!existing) {
    return err({ reason: "MESSAGE_NOT_FOUND" });
  }
  const message = await MessageRepo.updateMessage(
    context.db,
    data.id,
    data.data,
  );
  return ok(message);
}

/**
 * Delete a message
 */
export async function deleteMessage(
  context: DbContext,
  data: DeleteMessageInput,
) {
  const existing = await MessageRepo.findMessageById(context.db, data.id);
  if (!existing) {
    return err({ reason: "MESSAGE_NOT_FOUND" });
  }
  await MessageRepo.deleteMessage(context.db, data.id);
  return ok({ success: true });
}
