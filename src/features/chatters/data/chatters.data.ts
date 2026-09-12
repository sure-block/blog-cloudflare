import { and, desc, eq, lt, sql } from "drizzle-orm";
import { ChattersTable } from "@/lib/db/schema";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Get chatters with cursor-based pagination (published only)
 */
export async function getPublishedChatters(
  db: DB,
  options: {
    cursor?: number;
    limit?: number;
  } = {},
) {
  const { cursor, limit = DEFAULT_PAGE_SIZE } = options;

  const conditions = [eq(ChattersTable.status, "published")];
  if (cursor) {
    conditions.push(lt(ChattersTable.id, cursor));
  }

  const items = await db
    .select()
    .from(ChattersTable)
    .where(and(...conditions))
    .orderBy(desc(ChattersTable.createdAt), desc(ChattersTable.id))
    .limit(Math.min(limit, 50));

  const nextCursor = items.length > 0 ? items[items.length - 1].id : null;
  return { items, nextCursor };
}

/**
 * Get all chatters (admin, any status)
 */
export async function getAllChatters(
  db: DB,
  options: {
    offset?: number;
    limit?: number;
    status?: "draft" | "published";
  } = {},
) {
  const { offset = 0, limit = DEFAULT_PAGE_SIZE, status } = options;

  const conditions = status ? [eq(ChattersTable.status, status)] : [];
  return await db
    .select()
    .from(ChattersTable)
    .where(and(...conditions))
    .orderBy(desc(ChattersTable.createdAt))
    .limit(Math.min(limit, 100))
    .offset(offset);
}

/**
 * Find a chatter by ID
 */
export async function findChatterById(db: DB, id: number) {
  return await db.query.ChattersTable.findFirst({
    where: eq(ChattersTable.id, id),
  });
}

/**
 * Insert a new chatter
 */
export async function insertChatter(
  db: DB,
  data: typeof ChattersTable.$inferInsert,
) {
  const [chatter] = await db.insert(ChattersTable).values(data).returning();
  return chatter;
}

/**
 * Update a chatter
 */
export async function updateChatter(
  db: DB,
  id: number,
  data: Partial<Omit<typeof ChattersTable.$inferInsert, "id" | "createdAt">>,
) {
  const [chatter] = await db
    .update(ChattersTable)
    .set(data)
    .where(eq(ChattersTable.id, id))
    .returning();
  return chatter;
}

/**
 * Delete a chatter
 */
export async function deleteChatter(db: DB, id: number) {
  await db.delete(ChattersTable).where(eq(ChattersTable.id, id));
}

/**
 * Increment likes
 */
export async function incrementChatterLikes(db: DB, id: number) {
  const [chatter] = await db
    .update(ChattersTable)
    .set({ likes: sql`${ChattersTable.likes} + 1` })
    .where(eq(ChattersTable.id, id))
    .returning();
  return chatter;
}

/**
 * Sync comments count (incremental)
 */
export async function adjustCommentsCount(
  db: DB,
  id: number,
  delta: 1 | -1,
) {
  const [chatter] = await db
    .update(ChattersTable)
    .set({ commentsCount: sql`${ChattersTable.commentsCount} + ${delta}` })
    .where(eq(ChattersTable.id, id))
    .returning();
  return chatter;
}
