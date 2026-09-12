import { and, desc, eq, isNull, lt, or } from "drizzle-orm";
import { ChatterCommentsTable } from "@/lib/db/schema";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Get approved comments for a chatter (root-only), cursor pagination
 */
export async function getChatterRootComments(
  db: DB,
  options: {
    chatterId: number;
    cursor?: number;
    limit?: number;
  },
) {
  const { chatterId, cursor, limit = DEFAULT_PAGE_SIZE } = options;

  const conditions = [
    eq(ChatterCommentsTable.chatterId, chatterId),
    eq(ChatterCommentsTable.status, "approved"),
    isNull(ChatterCommentsTable.parentId),
  ];
  if (cursor) {
    conditions.push(lt(ChatterCommentsTable.id, cursor));
  }

  const items = await db
    .select()
    .from(ChatterCommentsTable)
    .where(and(...conditions))
    .orderBy(desc(ChatterCommentsTable.createdAt), desc(ChatterCommentsTable.id))
    .limit(Math.min(limit, 50));

  const nextCursor = items.length > 0 ? items[items.length - 1].id : null;
  return { items, nextCursor };
}

/**
 * Get replies for a set of comment ids
 */
export async function getChatterRepliesByCommentIds(
  db: DB,
  commentIds: number[],
) {
  if (commentIds.length === 0) return [];
  return await db
    .select()
    .from(ChatterCommentsTable)
    .where(
      and(
        eq(ChatterCommentsTable.status, "approved"),
        or(...commentIds.map((id) => eq(ChatterCommentsTable.parentId, id))),
      ),
    )
    .orderBy(desc(ChatterCommentsTable.createdAt));
}

/**
 * Insert a chatter comment
 */
export async function insertChatterComment(
  db: DB,
  data: typeof ChatterCommentsTable.$inferInsert,
) {
  const [comment] = await db
    .insert(ChatterCommentsTable)
    .values(data)
    .returning();
  return comment;
}

/**
 * Find a chatter comment by ID
 */
export async function findChatterCommentById(db: DB, id: number) {
  return await db.query.ChatterCommentsTable.findFirst({
    where: eq(ChatterCommentsTable.id, id),
  });
}

/**
 * Delete a chatter comment
 */
export async function deleteChatterComment(db: DB, id: number) {
  await db
    .delete(ChatterCommentsTable)
    .where(eq(ChatterCommentsTable.id, id));
}
