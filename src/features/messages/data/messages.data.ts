import { and, desc, eq, isNull, lt, or } from "drizzle-orm";
import { MessagesTable } from "@/lib/db/schema";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Get approved messages (guestbook), cursor pagination, root-only
 */
export async function getApprovedMessages(
  db: DB,
  options: { cursor?: number; limit?: number } = {},
) {
  const { cursor, limit = DEFAULT_PAGE_SIZE } = options;

  const conditions = [
    eq(MessagesTable.status, "approved"),
    isNull(MessagesTable.parentId),
  ];
  if (cursor) {
    conditions.push(lt(MessagesTable.id, cursor));
  }

  const items = await db
    .select()
    .from(MessagesTable)
    .where(and(...conditions))
    .orderBy(desc(MessagesTable.createdAt), desc(MessagesTable.id))
    .limit(Math.min(limit, 50));

  const nextCursor = items.length > 0 ? items[items.length - 1].id : null;
  return { items, nextCursor };
}

/**
 * Get replies for a list of message ids
 */
export async function getRepliesByMessageIds(db: DB, messageIds: number[]) {
  if (messageIds.length === 0) return [];
  return await db
    .select()
    .from(MessagesTable)
    .where(
      and(
        eq(MessagesTable.status, "approved"),
        or(...messageIds.map((id) => eq(MessagesTable.parentId, id))),
      ),
    )
    .orderBy(desc(MessagesTable.createdAt), desc(MessagesTable.id));
}

/**
 * Get all messages (admin)
 */
export async function getAllMessages(
  db: DB,
  options: {
    offset?: number;
    limit?: number;
    status?: "pending" | "approved" | "rejected";
  } = {},
) {
  const { offset = 0, limit = DEFAULT_PAGE_SIZE, status } = options;
  const conditions = status ? [eq(MessagesTable.status, status)] : [];
  return await db
    .select()
    .from(MessagesTable)
    .where(and(...conditions))
    .orderBy(desc(MessagesTable.createdAt))
    .limit(Math.min(limit, 100))
    .offset(offset);
}

/**
 * Find a message by ID
 */
export async function findMessageById(db: DB, id: number) {
  return await db.query.MessagesTable.findFirst({
    where: eq(MessagesTable.id, id),
  });
}

/**
 * Insert a new message
 */
export async function insertMessage(
  db: DB,
  data: typeof MessagesTable.$inferInsert,
) {
  const [message] = await db.insert(MessagesTable).values(data).returning();
  return message;
}

/**
 * Update a message
 */
export async function updateMessage(
  db: DB,
  id: number,
  data: Partial<Omit<typeof MessagesTable.$inferInsert, "id" | "createdAt">>,
) {
  const [message] = await db
    .update(MessagesTable)
    .set(data)
    .where(eq(MessagesTable.id, id))
    .returning();
  return message;
}

/**
 * Delete a message (replies cascade)
 */
export async function deleteMessage(db: DB, id: number) {
  await db.delete(MessagesTable).where(eq(MessagesTable.id, id));
}

/**
 * Count pending messages
 */
export async function countPendingMessages(db: DB) {
  const rows = await db
    .select({ c: MessagesTable.id })
    .from(MessagesTable)
    .where(eq(MessagesTable.status, "pending"));
  return rows.length;
}
