import * as LoginLogRepo from "@/features/login-logs/data/login-logs.data";
import { ok } from "@/lib/errors";

/**
 * Get login logs with pagination (admin)
 */
export async function getLoginLogs(
  context: DbContext,
  data: { offset?: number; limit?: number; username?: string } = {},
) {
  const { offset = 0, limit = 50, username } = data;
  const logs = await LoginLogRepo.getLoginLogs(context.db, {
    offset,
    limit,
    username,
  });
  return ok(logs);
}
