import { and, asc, desc, eq } from "drizzle-orm";
import { ProjectsTable } from "@/lib/db/schema";

/**
 * Get all projects, optionally filtered by status / featured
 */
export async function getAllProjects(
  db: DB,
  options: {
    status?: "developing" | "finished" | "archived";
    featuredOnly?: boolean;
    limit?: number;
  } = {},
) {
  const { status, featuredOnly, limit = 100 } = options;

  const conditions = [];
  if (status) {
    conditions.push(eq(ProjectsTable.status, status));
  }
  if (featuredOnly) {
    conditions.push(eq(ProjectsTable.isFeatured, true));
  }

  return await db
    .select()
    .from(ProjectsTable)
    .where(and(...conditions))
    .orderBy(
      desc(ProjectsTable.isFeatured),
      asc(ProjectsTable.sort),
      desc(ProjectsTable.createdAt),
    )
    .limit(Math.min(limit, 200));
}

/**
 * Find a project by ID
 */
export async function findProjectById(db: DB, id: number) {
  return await db.query.ProjectsTable.findFirst({
    where: eq(ProjectsTable.id, id),
  });
}

/**
 * Find a project by slug
 */
export async function findProjectBySlug(db: DB, slug: string) {
  return await db.query.ProjectsTable.findFirst({
    where: eq(ProjectsTable.slug, slug),
  });
}

/**
 * Check if a project slug exists
 */
export async function slugExists(
  db: DB,
  slug: string,
  options: { excludeId?: number } = {},
): Promise<boolean> {
  const conditions = [eq(ProjectsTable.slug, slug)];
  if (options.excludeId) {
    conditions.push(eq(ProjectsTable.id, options.excludeId));
  }
  const results = await db
    .select({ id: ProjectsTable.id })
    .from(ProjectsTable)
    .where(and(...conditions))
    .limit(1);
  return results.length > 0;
}

/**
 * Insert a new project
 */
export async function insertProject(
  db: DB,
  data: typeof ProjectsTable.$inferInsert,
) {
  const [project] = await db.insert(ProjectsTable).values(data).returning();
  return project;
}

/**
 * Update a project
 */
export async function updateProject(
  db: DB,
  id: number,
  data: Partial<Omit<typeof ProjectsTable.$inferInsert, "id" | "createdAt">>,
) {
  const [project] = await db
    .update(ProjectsTable)
    .set(data)
    .where(eq(ProjectsTable.id, id))
    .returning();
  return project;
}

/**
 * Delete a project
 */
export async function deleteProject(db: DB, id: number) {
  await db.delete(ProjectsTable).where(eq(ProjectsTable.id, id));
}
