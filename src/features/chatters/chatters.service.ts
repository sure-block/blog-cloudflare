import * as ChatterRepo from "@/features/chatters/data/chatters.data";
import * as ChatterCommentRepo from "@/features/chatters/data/chatter-comments.data";
import type {
  CreateChatterInput,
  DeleteChatterInput,
  GetChattersInput,
  LikeChatterInput,
  UpdateChatterInput,
} from "@/features/chatters/chatters.schema";
import type {
  CreateChatterCommentInput,
  DeleteChatterCommentInput,
  GetChatterCommentsInput,
} from "@/features/chatters/chatter-comments.schema";
import { err, ok } from "@/lib/errors";

/**
 * Get published chatters (public feed)
 */
export async function getChatters(
  context: DbContext,
  data: GetChattersInput = {},
) {
  const { cursor, limit } = data;
  return await ChatterRepo.getPublishedChatters(context.db, { cursor, limit });
}

/**
 * Get all chatters (admin)
 */
export async function getAllChatters(
  context: DbContext,
  data: { offset?: number; limit?: number; status?: "draft" | "published" } = {},
) {
  return await ChatterRepo.getAllChatters(context.db, data);
}

/**
 * Create a chatter
 */
export async function createChatter(
  context: DbContext,
  data: CreateChatterInput,
) {
  const chatter = await ChatterRepo.insertChatter(context.db, {
    content: data.content,
    images: data.images ?? [],
    mood: data.mood ?? "",
  });
  return ok(chatter);
}

/**
 * Update a chatter
 */
export async function updateChatter(
  context: DbContext,
  data: UpdateChatterInput,
) {
  const existing = await ChatterRepo.findChatterById(context.db, data.id);
  if (!existing) {
    return err({ reason: "CHATTER_NOT_FOUND" });
  }
  const chatter = await ChatterRepo.updateChatter(context.db, data.id, data.data);
  return ok(chatter);
}

/**
 * Delete a chatter
 */
export async function deleteChatter(
  context: DbContext,
  data: DeleteChatterInput,
) {
  const existing = await ChatterRepo.findChatterById(context.db, data.id);
  if (!existing) {
    return err({ reason: "CHATTER_NOT_FOUND" });
  }
  await ChatterRepo.deleteChatter(context.db, data.id);
  return ok({ success: true });
}

/**
 * Like a chatter
 */
export async function likeChatter(
  context: DbContext,
  data: LikeChatterInput,
) {
  const existing = await ChatterRepo.findChatterById(context.db, data.id);
  if (!existing) {
    return err({ reason: "CHATTER_NOT_FOUND" });
  }
  const chatter = await ChatterRepo.incrementChatterLikes(context.db, data.id);
  return ok({ likes: chatter.likes });
}

/**
 * Get comments for a chatter
 */
export async function getChatterComments(
  context: DbContext,
  data: GetChatterCommentsInput,
) {
  const { chatterId, cursor, limit } = data;
  const { items, nextCursor } = await ChatterCommentRepo.getChatterRootComments(
    context.db,
    { chatterId, cursor, limit },
  );

  // Fetch replies for root comments
  const rootIds = items.map((c) => c.id);
  const replies = await ChatterCommentRepo.getChatterRepliesByCommentIds(
    context.db,
    rootIds,
  );

  return {
    items: items.map((root) => ({
      ...root,
      replies: replies.filter((r) => r.parentId === root.id),
    })),
    nextCursor,
  };
}

/**
 * Post a comment to a chatter
 */
export async function createChatterComment(
  context: DbContext,
  data: CreateChatterCommentInput,
) {
  const chatter = await ChatterRepo.findChatterById(context.db, data.chatterId);
  if (!chatter) {
    return err({ reason: "CHATTER_NOT_FOUND" });
  }

  const comment = await ChatterCommentRepo.insertChatterComment(context.db, {
    chatterId: data.chatterId,
    parentId: data.parentId ?? null,
    content: data.content,
    emailUserName: data.emailUserName ?? "",
    emailUserAvatar: data.emailUserAvatar ?? "",
    status: "approved",
  });

  await ChatterRepo.adjustCommentsCount(context.db, data.chatterId, 1);
  return ok(comment);
}

/**
 * Delete a chatter comment
 */
export async function deleteChatterComment(
  context: DbContext,
  data: DeleteChatterCommentInput,
) {
  const existing = await ChatterCommentRepo.findChatterCommentById(
    context.db,
    data.id,
  );
  if (!existing) {
    return err({ reason: "COMMENT_NOT_FOUND" });
  }
  await ChatterCommentRepo.deleteChatterComment(context.db, data.id);
  await ChatterRepo.adjustCommentsCount(context.db, existing.chatterId, -1);
  return ok({ success: true });
}
