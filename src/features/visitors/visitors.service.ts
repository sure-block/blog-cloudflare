import { eq } from "drizzle-orm";
import { VisitorsTable } from "@/lib/db/schema";
import * as VisitorRepo from "@/features/visitors/data/visitors.data";
import { err, ok } from "@/lib/errors";

/**
 * Get visitor statistics (total / week / month)
 */
export async function getVisitorStats(context: DbContext) {
  return ok(await VisitorRepo.getVisitorStats(context.db));
}

/**
 * Get recent visitor records (admin)
 */
export async function getRecentVisitors(
  context: DbContext,
  data: { limit?: number } = {},
) {
  return ok(await VisitorRepo.getRecentVisitors(context.db, data.limit ?? 50));
}

/**
 * Get visits by day for chart (admin)
 */
export async function getVisitorsByDay(
  context: DbContext,
  data: { days?: number } = {},
) {
  return ok(await VisitorRepo.getVisitorsByDay(context.db, data.days ?? 30));
}

/**
 * Delete a single visitor record (admin)
 */
export async function deleteVisitor(context: DbContext, id: number) {
  const deleted = await context.db
    .delete(VisitorsTable)
    .where(eq(VisitorsTable.id, id))
    .returning();
  if (deleted.length === 0) {
    return err({ reason: "VISITOR_NOT_FOUND" });
  }
  return ok(deleted[0]);
}

/**
 * Clear all visitor records (admin)
 */
export async function clearVisitors(context: DbContext) {
  const result = await context.db.delete(VisitorsTable);
  return ok({ deletedCount: result.meta?.changes ?? 0 });
}
