import { asc, eq, inArray } from "drizzle-orm";
import { BookmarkCategoriesTable, BookmarkSitesTable } from "@/lib/db/schema";

/**
 * Get all bookmark categories, optionally with sites
 */
export async function getBookmarkCategories(
  db: DB,
  options: { withSites?: boolean } = {},
) {
  const { withSites = true } = options;

  const categories = await db
    .select()
    .from(BookmarkCategoriesTable)
    .orderBy(asc(BookmarkCategoriesTable.sort));

  if (!withSites) return categories;

  const ids = categories.map((c) => c.id);
  if (ids.length === 0) return categories;

  const sites = await db
    .select()
    .from(BookmarkSitesTable)
    .where(inArray(BookmarkSitesTable.categoryId, ids))
    .orderBy(asc(BookmarkSitesTable.sort));

  const byCategory = new Map<number, typeof BookmarkSitesTable.$inferSelect[]>();
  for (const site of sites) {
    const list = byCategory.get(site.categoryId) ?? [];
    list.push(site);
    byCategory.set(site.categoryId, list);
  }

  return categories.map((category) => ({
    ...category,
    sites: byCategory.get(category.id) ?? [],
  }));
}

/**
 * Find a bookmark category by ID
 */
export async function findBookmarkCategoryById(db: DB, id: number) {
  return await db.query.BookmarkCategoriesTable.findFirst({
    where: eq(BookmarkCategoriesTable.id, id),
  });
}

/**
 * Insert a bookmark category
 */
export async function insertBookmarkCategory(
  db: DB,
  data: typeof BookmarkCategoriesTable.$inferInsert,
) {
  const [category] = await db
    .insert(BookmarkCategoriesTable)
    .values(data)
    .returning();
  return category;
}

/**
 * Update a bookmark category
 */
export async function updateBookmarkCategory(
  db: DB,
  id: number,
  data: Partial<
    Omit<typeof BookmarkCategoriesTable.$inferInsert, "id" | "createdAt">
  >,
) {
  const [category] = await db
    .update(BookmarkCategoriesTable)
    .set(data)
    .where(eq(BookmarkCategoriesTable.id, id))
    .returning();
  return category;
}

/**
 * Delete a bookmark category (sites cascade)
 */
export async function deleteBookmarkCategory(db: DB, id: number) {
  await db
    .delete(BookmarkCategoriesTable)
    .where(eq(BookmarkCategoriesTable.id, id));
}

/**
 * Find a bookmark site by ID
 */
export async function findBookmarkSiteById(db: DB, id: number) {
  return await db.query.BookmarkSitesTable.findFirst({
    where: eq(BookmarkSitesTable.id, id),
  });
}

/**
 * Insert a bookmark site
 */
export async function insertBookmarkSite(
  db: DB,
  data: typeof BookmarkSitesTable.$inferInsert,
) {
  const [site] = await db.insert(BookmarkSitesTable).values(data).returning();
  return site;
}

/**
 * Update a bookmark site
 */
export async function updateBookmarkSite(
  db: DB,
  id: number,
  data: Partial<Omit<typeof BookmarkSitesTable.$inferInsert, "id" | "createdAt">>,
) {
  const [site] = await db
    .update(BookmarkSitesTable)
    .set(data)
    .where(eq(BookmarkSitesTable.id, id))
    .returning();
  return site;
}

/**
 * Delete a bookmark site
 */
export async function deleteBookmarkSite(db: DB, id: number) {
  await db.delete(BookmarkSitesTable).where(eq(BookmarkSitesTable.id, id));
}
