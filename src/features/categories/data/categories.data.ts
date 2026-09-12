import { and, asc, count, desc, eq, lte, ne } from "drizzle-orm";
import { CategoriesTable, PostsTable } from "@/lib/db/schema";

/**
 * Get all categories, optionally sorted
 */
export async function getAllCategories(
  db: DB,
  options: {
    sortBy?: "name" | "createdAt" | "sort";
    sortDir?: "asc" | "desc";
  } = {},
) {
  const { sortBy = "sort", sortDir = "asc" } = options;

  const orderFn = sortDir === "asc" ? asc : desc;
  const orderColumn =
    sortBy === "createdAt"
      ? CategoriesTable.createdAt
      : sortBy === "name"
        ? CategoriesTable.name
        : CategoriesTable.sort;

  return await db
    .select()
    .from(CategoriesTable)
    .orderBy(orderFn(orderColumn));
}

/**
 * Get all categories with published post counts
 */
export async function getAllCategoriesWithCount(
  db: DB,
  options: {
    sortBy?: "name" | "createdAt" | "sort" | "postCount";
    sortDir?: "asc" | "desc";
    publicOnly?: boolean;
  } = {},
) {
  const { sortBy = "sort", sortDir = "asc", publicOnly = false } = options;

  const query = db
    .select({
      id: CategoriesTable.id,
      name: CategoriesTable.name,
      slug: CategoriesTable.slug,
      description: CategoriesTable.description,
      sort: CategoriesTable.sort,
      postCount: CategoriesTable.postCount,
      createdAt: CategoriesTable.createdAt,
      updatedAt: CategoriesTable.updatedAt,
    })
    .from(CategoriesTable)
    .$dynamic();

  if (publicOnly) {
    // Count published posts only
    query.where(
      and(
        eq(PostsTable.status, "published"),
        lte(PostsTable.publishedAt, new Date()),
      ),
    );
  }

  const orderFn = sortDir === "asc" ? asc : desc;
  const orderColumn =
    sortBy === "createdAt"
      ? CategoriesTable.createdAt
      : sortBy === "name"
        ? CategoriesTable.name
        : CategoriesTable.sort;
  query.orderBy(orderFn(orderColumn));

  return await query;
}

/**
 * Find a category by ID
 */
export async function findCategoryById(db: DB, id: number) {
  return await db.query.CategoriesTable.findFirst({
    where: eq(CategoriesTable.id, id),
  });
}

/**
 * Find a category by slug
 */
export async function findCategoryBySlug(db: DB, slug: string) {
  return await db.query.CategoriesTable.findFirst({
    where: eq(CategoriesTable.slug, slug),
  });
}

/**
 * Find a category by name
 */
export async function findCategoryByName(db: DB, name: string) {
  return await db.query.CategoriesTable.findFirst({
    where: eq(CategoriesTable.name, name),
  });
}

/**
 * Insert a new category
 */
export async function insertCategory(
  db: DB,
  data: typeof CategoriesTable.$inferInsert,
) {
  const [category] = await db.insert(CategoriesTable).values(data).returning();
  return category;
}

/**
 * Update a category
 */
export async function updateCategory(
  db: DB,
  id: number,
  data: Partial<Omit<typeof CategoriesTable.$inferInsert, "id" | "createdAt">>,
) {
  const [category] = await db
    .update(CategoriesTable)
    .set(data)
    .where(eq(CategoriesTable.id, id))
    .returning();
  return category;
}

/**
 * Delete a category (posts keep their category_id as null via ON DELETE SET NULL)
 */
export async function deleteCategory(db: DB, id: number) {
  await db.delete(CategoriesTable).where(eq(CategoriesTable.id, id));
}

/**
 * Check if a category name exists
 */
export async function nameExists(
  db: DB,
  name: string,
  options: { excludeId?: number } = {},
): Promise<boolean> {
  const { excludeId } = options;
  const conditions = [eq(CategoriesTable.name, name)];
  if (excludeId) {
    conditions.push(ne(CategoriesTable.id, excludeId));
  }
  const results = await db
    .select({ id: CategoriesTable.id })
    .from(CategoriesTable)
    .where(and(...conditions))
    .limit(1);
  return results.length > 0;
}

/**
 * Check if a category slug exists
 */
export async function slugExists(
  db: DB,
  slug: string,
  options: { excludeId?: number } = {},
): Promise<boolean> {
  const { excludeId } = options;
  const conditions = [eq(CategoriesTable.slug, slug)];
  if (excludeId) {
    conditions.push(ne(CategoriesTable.id, excludeId));
  }
  const results = await db
    .select({ id: CategoriesTable.id })
    .from(CategoriesTable)
    .where(and(...conditions))
    .limit(1);
  return results.length > 0;
}

/**
 * Recompute stored post_count for all categories
 */
export async function refreshPostCounts(db: DB) {
  const rows = await db
    .select({
      categoryId: PostsTable.categoryId,
      postCount: count(PostsTable.id).as("postCount"),
    })
    .from(PostsTable)
    .where(
      and(
        eq(PostsTable.status, "published"),
        lte(PostsTable.publishedAt, new Date()),
      ),
    )
    .groupBy(PostsTable.categoryId);

  for (const row of rows) {
    if (row.categoryId !== null) {
      await db
        .update(CategoriesTable)
        .set({ postCount: row.postCount })
        .where(eq(CategoriesTable.id, row.categoryId));
    }
  }
}

/**
 * Get published posts for a category (for cache invalidation)
 */
export async function getPublishedPostsByCategoryId(
  db: DB,
  categoryId: number,
) {
  const results = await db
    .select({
      id: PostsTable.id,
      slug: PostsTable.slug,
    })
    .from(PostsTable)
    .where(
      and(
        eq(PostsTable.categoryId, categoryId),
        eq(PostsTable.status, "published"),
        lte(PostsTable.publishedAt, new Date()),
      ),
    );

  return results;
}

/**
 * Get categories for a specific post
 */
export async function getCategoryByPostId(db: DB, postId: number) {
  return await db.query.PostsTable.findFirst({
    where: eq(PostsTable.id, postId),
    columns: { categoryId: true },
    with: {
      category: true,
    },
  });
}
