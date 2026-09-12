import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id } from "./helper";

/** 登录日志（映射第二站 LoginLog 表） */
export const LoginLogsTable = sqliteTable(
  "login_logs",
  {
    id,
    userId: integer("user_id").notNull().default(0),
    username: text().notNull().default(""),
    ip: text().notNull().default(""),
    address: text().notNull().default(""),
    system: text().notNull().default(""),
    browser: text().notNull().default(""),
    summary: text().notNull().default(""),
    operatingTime: integer("operating_time", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    createdAt,
  },
  (table) => [
    index("login_logs_user_idx").on(table.userId),
    index("login_logs_time_idx").on(table.operatingTime),
  ],
);

// ==================== types ====================
export type LoginLog = typeof LoginLogsTable.$inferSelect;
