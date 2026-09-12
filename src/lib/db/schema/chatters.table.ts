import { relations } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.table";
import { createdAt, id, updatedAt } from "./helper";

export const CHATTER_STATUSES = ["draft", "published"] as const;

/** 说说/动态（映射第二站 Chatter 表） */
export const ChattersTable = sqliteTable(
  "chatters",
  {
    id,
    content: text().notNull(),
    images: text({ mode: "json" }).$type<string[]>().notNull().default([]),
    mood: text().notNull().default(""),
    likes: integer().notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    status: text("status", { enum: CHATTER_STATUSES })
      .notNull()
      .default("draft"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("chatters_status_created_idx").on(table.status, table.createdAt),
  ],
);

/** 说说评论（映射第二站 ChatterComment 表） */
export const ChatterCommentsTable = sqliteTable(
  "chatter_comments",
  {
    id,
    chatterId: integer("chatter_id")
      .notNull()
      .references(() => ChattersTable.id, { onDelete: "cascade" }),
    parentId: integer("parent_id").references(
      (): AnySQLiteColumn => ChatterCommentsTable.id,
      { onDelete: "cascade" },
    ),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    emailUserName: text("email_user_name").notNull().default(""),
    emailUserAvatar: text("email_user_avatar").notNull().default(""),
    content: text().notNull(),
    ip: text().notNull().default(""),
    likes: integer().notNull().default(0),
    status: text("status").notNull().default("approved"),
    createdAt,
  },
  (table) => [
    index("chatter_comments_chatter_created_idx").on(
      table.chatterId,
      table.createdAt,
    ),
    index("chatter_comments_status_idx").on(table.status),
  ],
);

// ==================== relations ====================
export const chattersRelations = relations(ChattersTable, ({ many }) => ({
  comments: many(ChatterCommentsTable),
}));

// ==================== types ====================
export type Chatter = typeof ChattersTable.$inferSelect;
export type ChatterStatus = (typeof CHATTER_STATUSES)[number];
export type ChatterComment = typeof ChatterCommentsTable.$inferSelect;
