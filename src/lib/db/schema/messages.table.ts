import { relations } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.table";
import { createdAt, id } from "./helper";

/** 留言板（映射第二站 Message 表） */
export const MessagesTable = sqliteTable(
  "messages",
  {
    id,
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    parentId: integer("parent_id").references(
      (): AnySQLiteColumn => MessagesTable.id,
      { onDelete: "cascade" },
    ),
    content: text().notNull(),
    ip: text().notNull().default(""),
    status: text("status").notNull().default("approved"),
    likes: integer().notNull().default(0),
    emailUserName: text("email_user_name").notNull().default(""),
    emailUserAvatar: text("email_user_avatar").notNull().default(""),
    createdAt,
  },
  (table) => [
    index("messages_status_created_idx").on(table.status, table.createdAt),
    index("messages_parent_idx").on(table.parentId),
  ],
);

// ==================== relations ====================
export const messagesRelations = relations(MessagesTable, ({ one, many }) => ({
  user: one(user, {
    fields: [MessagesTable.userId],
    references: [user.id],
  }),
  replies: many(MessagesTable, {
    relationName: "message_replies",
  }),
  parent: one(MessagesTable, {
    relationName: "message_replies",
    fields: [MessagesTable.parentId],
    references: [MessagesTable.id],
  }),
}));

// ==================== types ====================
export type Message = typeof MessagesTable.$inferSelect;
