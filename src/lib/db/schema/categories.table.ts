import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "./helper";

/** 文章分类（映射第二站 Category 表） */
export const CategoriesTable = sqliteTable(
  "categories",
  {
    id,
    name: text().notNull().unique(),
    slug: text().notNull().unique(),
    description: text().notNull().default(""),
    sort: integer().notNull().default(0),
    postCount: integer("post_count").notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [index("categories_sort_idx").on(table.sort)],
);

// ==================== types ====================
export type Category = typeof CategoriesTable.$inferSelect;
