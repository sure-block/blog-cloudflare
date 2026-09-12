import { and, asc, eq } from "drizzle-orm";
import { MusicTable } from "@/lib/db/schema";

/**
 * Get all music, optionally filtered by type
 */
export async function getAllMusic(
  db: DB,
  options: { type?: "local" | "netease"; limit?: number } = {},
) {
  const { type, limit = 100 } = options;
  const conditions = type ? [eq(MusicTable.type, type)] : [];
  return await db
    .select()
    .from(MusicTable)
    .where(and(...conditions))
    .orderBy(asc(MusicTable.sort), asc(MusicTable.id))
    .limit(Math.min(limit, 200));
}

/**
 * Find music by ID
 */
export async function findMusicById(db: DB, id: number) {
  return await db.query.MusicTable.findFirst({
    where: eq(MusicTable.id, id),
  });
}

/**
 * Insert new music
 */
export async function insertMusic(
  db: DB,
  data: typeof MusicTable.$inferInsert,
) {
  const [music] = await db.insert(MusicTable).values(data).returning();
  return music;
}

/**
 * Update music
 */
export async function updateMusic(
  db: DB,
  id: number,
  data: Partial<Omit<typeof MusicTable.$inferInsert, "id" | "createdAt">>,
) {
  const [music] = await db
    .update(MusicTable)
    .set(data)
    .where(eq(MusicTable.id, id))
    .returning();
  return music;
}

/**
 * Delete music
 */
export async function deleteMusic(db: DB, id: number) {
  await db.delete(MusicTable).where(eq(MusicTable.id, id));
}
