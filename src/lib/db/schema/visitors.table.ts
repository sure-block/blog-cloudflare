import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id } from "./helper";

/** 访客记录（映射第二站 Visitor 表） */
export const VisitorsTable = sqliteTable(
  "visitors",
  {
    id,
    ip: text().notNull(),
    path: text().notNull().default(""),
    userAgent: text("user_agent").notNull().default(""),
    city: text().notNull().default(""),
    region: text().notNull().default(""),
    country: text().notNull().default(""),
    district: text().notNull().default(""),
    org: text().notNull().default(""),
    asn: text().notNull().default(""),
    isMobile: integer("is_mobile", { mode: "boolean" }).notNull().default(false),
    isProxy: integer("is_proxy", { mode: "boolean" }).notNull().default(false),
    isHosting: integer("is_hosting", { mode: "boolean" }).notNull().default(false),
    browser: text().notNull().default(""),
    os: text().notNull().default(""),
    deviceType: text("device_type").notNull().default(""),
    createdAt,
  },
  (table) => [
    index("visitors_ip_idx").on(table.ip),
    index("visitors_created_idx").on(table.createdAt),
  ],
);

// ==================== types ====================
export type Visitor = typeof VisitorsTable.$inferSelect;
