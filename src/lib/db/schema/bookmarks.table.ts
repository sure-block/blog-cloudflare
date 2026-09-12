import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "./helper";

/** 收藏夹分类（映射第二站 BookmarkCategory 表） */
export const BookmarkCategoriesTable = sqliteTable(
  "bookmark_categories",
  {
    id,
    name: text().notNull(),
    icon: text().notNull().default(""),
    description: text().notNull().default(""),
    sort: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [index("bookmark_categories_sort_idx").on(table.sort)],
);

/** 收藏站点（映射第二站 BookmarkSite 表） */
export const BookmarkSitesTable = sqliteTable(
  "bookmark_sites",
  {
    id,
    categoryId: integer("category_id")
      .notNull()
      .references(() => BookmarkCategoriesTable.id, { onDelete: "cascade" }),
    name: text().notNull(),
    url: text().notNull(),
    icon: text().notNull().default(""),
    description: text().notNull().default(""),
    platforms: text({ mode: "json" }).$type<string[]>().notNull().default([]),
    sort: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [index("bookmark_sites_category_idx").on(table.categoryId, table.sort)],
);

// ==================== relations ====================
export const bookmarkCategoriesRelations = relations(
  BookmarkCategoriesTable,
  ({ many }) => ({
    sites: many(BookmarkSitesTable),
  }),
);

// ==================== types ====================
export type BookmarkCategory = typeof BookmarkCategoriesTable.$inferSelect;
export type BookmarkSite = typeof BookmarkSitesTable.$inferSelect;
