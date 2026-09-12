import { asc, count, desc, eq, inArray } from "drizzle-orm";
import { AlbumsTable, PhotosTable } from "@/lib/db/schema";

/**
 * Get all albums, optionally with photos
 */
export async function getAllAlbums(
  db: DB,
  options: { withPhotos?: boolean; limit?: number } = {},
) {
  const { withPhotos = false, limit = 100 } = options;

  const albums = await db
    .select({
      id: AlbumsTable.id,
      title: AlbumsTable.title,
      description: AlbumsTable.description,
      cover: AlbumsTable.cover,
      photoCount: AlbumsTable.photoCount,
      sort: AlbumsTable.sort,
      createdAt: AlbumsTable.createdAt,
      updatedAt: AlbumsTable.updatedAt,
    })
    .from(AlbumsTable)
    .orderBy(asc(AlbumsTable.sort), desc(AlbumsTable.createdAt))
    .limit(Math.min(limit, 200));

  if (!withPhotos) return albums;

  const albumIds = albums.map((a) => a.id);
  if (albumIds.length === 0) return albums;

  const photos = await db
    .select()
    .from(PhotosTable)
    .where(inArray(PhotosTable.albumId, albumIds))
    .orderBy(asc(PhotosTable.sort));

  const byAlbum = new Map<number, typeof PhotosTable.$inferSelect[]>();
  for (const photo of photos) {
    const list = byAlbum.get(photo.albumId) ?? [];
    list.push(photo);
    byAlbum.set(photo.albumId, list);
  }

  return albums.map((album) => ({
    ...album,
    photos: byAlbum.get(album.id) ?? [],
  }));
}

/**
 * Find an album by ID
 */
export async function findAlbumById(db: DB, id: number) {
  return await db.query.AlbumsTable.findFirst({
    where: eq(AlbumsTable.id, id),
    with: {
      photos: {
        orderBy: (photos, { asc }) => [asc(photos.sort)],
      },
    },
  });
}

/**
 * Insert a new album
 */
export async function insertAlbum(
  db: DB,
  data: typeof AlbumsTable.$inferInsert,
) {
  const [album] = await db.insert(AlbumsTable).values(data).returning();
  return album;
}

/**
 * Update an album
 */
export async function updateAlbum(
  db: DB,
  id: number,
  data: Partial<Omit<typeof AlbumsTable.$inferInsert, "id" | "createdAt">>,
) {
  const [album] = await db
    .update(AlbumsTable)
    .set(data)
    .where(eq(AlbumsTable.id, id))
    .returning();
  return album;
}

/**
 * Delete an album (photos cascade)
 */
export async function deleteAlbum(db: DB, id: number) {
  await db.delete(AlbumsTable).where(eq(AlbumsTable.id, id));
}

/**
 * Add a photo to an album
 */
export async function insertPhoto(
  db: DB,
  data: typeof PhotosTable.$inferInsert,
) {
  const [photo] = await db.insert(PhotosTable).values(data).returning();

  // Bump album photo count
  const countResult = await db
    .select({ c: count(PhotosTable.id) })
    .from(PhotosTable)
    .where(eq(PhotosTable.albumId, data.albumId));
  const photoCount = countResult[0]?.c ?? 0;
  await db
    .update(AlbumsTable)
    .set({ photoCount })
    .where(eq(AlbumsTable.id, data.albumId));

  return photo;
}

/**
 * Delete a photo
 */
export async function deletePhoto(db: DB, id: number) {
  const photo = await db.query.PhotosTable.findFirst({
    where: eq(PhotosTable.id, id),
  });
  if (!photo) return;

  await db.delete(PhotosTable).where(eq(PhotosTable.id, id));

  // Recompute album photo count
  const countResult = await db
    .select({ c: count(PhotosTable.id) })
    .from(PhotosTable)
    .where(eq(PhotosTable.albumId, photo.albumId));
  const photoCount = countResult[0]?.c ?? 0;
  await db
    .update(AlbumsTable)
    .set({ photoCount })
    .where(eq(AlbumsTable.id, photo.albumId));
}
