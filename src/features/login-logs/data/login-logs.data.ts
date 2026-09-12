import { and, desc, eq } from "drizzle-orm";
import { LoginLogsTable } from "@/lib/db/schema";

/**
 * Insert a login log entry
 */
export async function insertLoginLog(
  db: DB,
  data: typeof LoginLogsTable.$inferInsert,
) {
  const [log] = await db.insert(LoginLogsTable).values(data).returning();
  return log;
}

/**
 * Get login logs (admin)
 */
export async function getLoginLogs(
  db: DB,
  options: {
    offset?: number;
    limit?: number;
    username?: string;
  } = {},
) {
  const { offset = 0, limit = 50, username } = options;
  const conditions = username ? [eq(LoginLogsTable.username, username)] : [];
  return await db
    .select()
    .from(LoginLogsTable)
    .where(and(...conditions))
    .orderBy(desc(LoginLogsTable.operatingTime))
    .limit(Math.min(limit, 100))
    .offset(offset);
}

/**
 * Get recent login attempts for a user within a window
 * (summary field carries outcome, e.g. "登录成功" / "密码错误")
 */
export async function getRecentAttempts(
  db: DB,
  username: string,
  since: Date,
) {
  const rows = await db
    .select()
    .from(LoginLogsTable)
    .where(eq(LoginLogsTable.username, username))
    .orderBy(desc(LoginLogsTable.operatingTime))
    .limit(50);
  return rows.filter((row) => row.operatingTime >= since);
}
