import { count, desc, sql } from "drizzle-orm";
import { VisitorsTable } from "@/lib/db/schema";

/**
 * Record a visit (each page view inserts one row; unique visitors
 * are counted by distinct IP within a time window)
 */
export async function recordVisit(
  db: DB,
  data: {
    ip: string;
    path?: string;
    userAgent?: string;
    browser?: string;
    os?: string;
    deviceType?: string;
    isMobile?: boolean;
    city?: string;
    region?: string;
    country?: string;
    district?: string;
    org?: string;
    asn?: string;
    isProxy?: boolean;
    isHosting?: boolean;
  },
) {
  const [visitor] = await db
    .insert(VisitorsTable)
    .values({
      ip: data.ip,
      path: data.path ?? "",
      userAgent: data.userAgent ?? "",
      browser: data.browser ?? "",
      os: data.os ?? "",
      deviceType: data.deviceType ?? "",
      isMobile: data.isMobile ?? false,
      city: data.city ?? "",
      region: data.region ?? "",
      country: data.country ?? "",
      district: data.district ?? "",
      org: data.org ?? "",
      asn: data.asn ?? "",
      isProxy: data.isProxy ?? false,
      isHosting: data.isHosting ?? false,
    })
    .returning();
  return visitor;
}

/**
 * Get visitor statistics
 */
export async function getVisitorStats(db: DB) {
  const totalRows = await db.select({ c: count() }).from(VisitorsTable);
  const totalVisits = totalRows[0]?.c ?? 0;

  // Unique IPs in last 7/30 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const monthAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);

  const weekRows = await db
    .select({ c: count() })
    .from(VisitorsTable)
    .where(sql`${VisitorsTable.createdAt} >= ${weekAgo}`);
  const monthRows = await db
    .select({ c: count() })
    .from(VisitorsTable)
    .where(sql`${VisitorsTable.createdAt} >= ${monthAgo}`);

  return {
    totalVisits,
    weekVisits: weekRows[0]?.c ?? 0,
    monthVisits: monthRows[0]?.c ?? 0,
  };
}

/**
 * Recent visits (admin)
 */
export async function getRecentVisitors(db: DB, limit = 20) {
  return await db
    .select()
    .from(VisitorsTable)
    .orderBy(desc(VisitorsTable.createdAt))
    .limit(Math.min(limit, 100));
}

/**
 * Visits by day (admin chart)
 */
export async function getVisitorsByDay(db: DB, days = 30) {
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  return await db
    .select({
      day: sql<string>`date(${VisitorsTable.createdAt}, 'localtime')`,
      visits: count(),
    })
    .from(VisitorsTable)
    .where(sql`${VisitorsTable.createdAt} >= ${since}`)
    .groupBy(sql`date(${VisitorsTable.createdAt}, 'localtime')`)
    .orderBy(sql`date(${VisitorsTable.createdAt}, 'localtime')`);
}
