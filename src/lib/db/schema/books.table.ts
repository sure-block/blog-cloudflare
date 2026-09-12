import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "./helper";

/** 图书分类（映射第二站 BookCategory 表） */
export const BookCategoriesTable = sqliteTable(
  "book_categories",
  {
    id,
    name: text().notNull().unique(),
    slug: text().notNull().unique(),
    description: text().notNull().default(""),
    sort: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [index("book_categories_sort_idx").on(table.sort)],
);

/** 图书（映射第二站 Book 表） */
export const BooksTable = sqliteTable(
  "books",
  {
    id,
    title: text().notNull(),
    author: text().notNull().default(""),
    cover: text().notNull().default(""),
    description: text().notNull().default(""),
    fileUrl: text("file_url").notNull(),
    format: text().notNull().default("epub"),
    fileSize: integer("file_size").notNull().default(0),
    categoryId: integer("category_id").references(
      () => BookCategoriesTable.id,
      { onDelete: "set null" },
    ),
    sort: integer().notNull().default(0),
    views: integer().notNull().default(0),
    chapterCount: integer("chapter_count").notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("books_category_idx").on(table.categoryId),
    index("books_format_idx").on(table.format),
  ],
);

/** 图书章节（映射第二站 BookChapter 表） */
export const BookChaptersTable = sqliteTable(
  "book_chapters",
  {
    id,
    bookId: integer("book_id")
      .notNull()
      .references(() => BooksTable.id, { onDelete: "cascade" }),
    title: text().notNull(),
    href: text().notNull(),
    order: integer().notNull().default(0),
    createdAt,
  },
  (table) => [
    index("book_chapters_book_order_idx").on(table.bookId, table.order),
  ],
);

/** 阅读进度（映射第二站 ReadingProgress 表） */
export const ReadingProgressTable = sqliteTable(
  "reading_progress",
  {
    id,
    bookId: integer("book_id")
      .notNull()
      .unique()
      .references(() => BooksTable.id, { onDelete: "cascade" }),
    chapterId: integer("chapter_id"),
    chapterTitle: text("chapter_title").notNull().default(""),
    position: integer("position").notNull().default(0),
    updatedAt,
  },
  (table) => [index("reading_progress_updated_idx").on(table.updatedAt)],
);

/** 读书笔记（映射第二站 BookNote 表） */
export const BookNotesTable = sqliteTable(
  "book_notes",
  {
    id,
    bookId: integer("book_id")
      .notNull()
      .references(() => BooksTable.id, { onDelete: "cascade" }),
    chapterId: integer("chapter_id"),
    text: text().notNull(),
    note: text().notNull().default(""),
    color: text().notNull().default("#facc15"),
    cfi: text().notNull().default(""),
    chapterTitle: text("chapter_title").notNull().default(""),
    createdAt,
  },
  (table) => [index("book_notes_book_idx").on(table.bookId)],
);

// ==================== relations ====================
export const booksRelations = relations(BooksTable, ({ one, many }) => ({
  category: one(BookCategoriesTable, {
    fields: [BooksTable.categoryId],
    references: [BookCategoriesTable.id],
  }),
  chapters: many(BookChaptersTable),
  notes: many(BookNotesTable),
}));

// ==================== types ====================
export type BookCategory = typeof BookCategoriesTable.$inferSelect;
export type Book = typeof BooksTable.$inferSelect;
export type BookChapter = typeof BookChaptersTable.$inferSelect;
export type ReadingProgress = typeof ReadingProgressTable.$inferSelect;
export type BookNote = typeof BookNotesTable.$inferSelect;
