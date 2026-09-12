import { and, asc, desc, eq, lt, sql } from "drizzle-orm";
import {
  BookCategoriesTable,
  BookChaptersTable,
  BookNotesTable,
  BooksTable,
  ReadingProgressTable,
} from "@/lib/db/schema";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Get all books with cursor-based pagination
 */
export async function getBooks(
  db: DB,
  options: {
    categorySlug?: string;
    limit?: number;
    cursor?: number;
  } = {},
) {
  const { categorySlug, limit = DEFAULT_PAGE_SIZE, cursor } = options;

  const conditions = [];
  if (categorySlug) {
    conditions.push(
      eq(BookCategoriesTable.slug, categorySlug),
    );
  }
  if (cursor) {
    conditions.push(lt(BooksTable.id, cursor));
  }

  const query = db
    .select({
      id: BooksTable.id,
      title: BooksTable.title,
      author: BooksTable.author,
      cover: BooksTable.cover,
      description: BooksTable.description,
      fileUrl: BooksTable.fileUrl,
      format: BooksTable.format,
      fileSize: BooksTable.fileSize,
      categoryId: BooksTable.categoryId,
      sort: BooksTable.sort,
      views: BooksTable.views,
      chapterCount: BooksTable.chapterCount,
      createdAt: BooksTable.createdAt,
      updatedAt: BooksTable.updatedAt,
    })
    .from(BooksTable)
    .leftJoin(
      BookCategoriesTable,
      eq(BooksTable.categoryId, BookCategoriesTable.id),
    )
    .where(and(...conditions))
    .orderBy(desc(BooksTable.sort), desc(BooksTable.id))
    .limit(Math.min(limit, 50))
    .$dynamic();

  const items = await query;
  const nextCursor = items.length > 0 ? items[items.length - 1].id : null;
  return { items, nextCursor };
}

/**
 * Find a book by ID with chapters
 */
export async function findBookById(db: DB, id: number) {
  const book = await db.query.BooksTable.findFirst({
    where: eq(BooksTable.id, id),
    with: {
      chapters: {
        orderBy: (chapters, { asc }) => [asc(chapters.order)],
      },
      category: true,
    },
  });
  return book;
}

/**
 * Find a book by ID (admin, no relations)
 */
export async function findBookByIdAdmin(db: DB, id: number) {
  return await db.query.BooksTable.findFirst({
    where: eq(BooksTable.id, id),
  });
}

/**
 * Increment book views
 */
export async function incrementBookViews(db: DB, id: number) {
  await db
    .update(BooksTable)
    .set({ views: sql`${BooksTable.views} + 1` })
    .where(eq(BooksTable.id, id));
}

/**
 * Insert a new book
 */
export async function insertBook(
  db: DB,
  data: typeof BooksTable.$inferInsert,
) {
  const [book] = await db.insert(BooksTable).values(data).returning();
  return book;
}

/**
 * Update a book
 */
export async function updateBook(
  db: DB,
  id: number,
  data: Partial<Omit<typeof BooksTable.$inferInsert, "id" | "createdAt">>,
) {
  const [book] = await db
    .update(BooksTable)
    .set(data)
    .where(eq(BooksTable.id, id))
    .returning();
  return book;
}

/**
 * Delete a book (chapters/notes/progress cascade)
 */
export async function deleteBook(db: DB, id: number) {
  await db.delete(BooksTable).where(eq(BooksTable.id, id));
}

/**
 * Replace chapters for a book (delete all + insert)
 */
export async function setBookChapters(
  db: DB,
  bookId: number,
  chapters: Array<{ title: string; href: string; order: number }>,
) {
  await db.delete(BookChaptersTable).where(eq(BookChaptersTable.bookId, bookId));
  if (chapters.length === 0) {
    await db
      .update(BooksTable)
      .set({ chapterCount: 0 })
      .where(eq(BooksTable.id, bookId));
    return;
  }
  await db.insert(BookChaptersTable).values(
    chapters.map((c) => ({ bookId, ...c })),
  );
  await db
    .update(BooksTable)
    .set({ chapterCount: chapters.length })
    .where(eq(BooksTable.id, bookId));
}

/**
 * Get reading progress for a book
 */
export async function getReadingProgress(db: DB, bookId: number) {
  return await db.query.ReadingProgressTable.findFirst({
    where: eq(ReadingProgressTable.bookId, bookId),
  });
}

/**
 * Upsert reading progress for a book
 */
export async function upsertReadingProgress(
  db: DB,
  data: {
    bookId: number;
    chapterId?: number | null;
    chapterTitle?: string;
    position?: number;
  },
) {
  const existing = await getReadingProgress(db, data.bookId);
  if (existing) {
    const [progress] = await db
      .update(ReadingProgressTable)
      .set({
        chapterId: data.chapterId ?? existing.chapterId,
        chapterTitle: data.chapterTitle ?? existing.chapterTitle,
        position: data.position ?? existing.position,
        updatedAt: new Date(),
      })
      .where(eq(ReadingProgressTable.bookId, data.bookId))
      .returning();
    return progress;
  }
  const [progress] = await db
    .insert(ReadingProgressTable)
    .values({
      bookId: data.bookId,
      chapterId: data.chapterId ?? null,
      chapterTitle: data.chapterTitle ?? "",
      position: data.position ?? 0,
    })
    .returning();
  return progress;
}

/**
 * Get notes for a book
 */
export async function getNotesByBookId(db: DB, bookId: number) {
  return await db
    .select()
    .from(BookNotesTable)
    .where(eq(BookNotesTable.bookId, bookId))
    .orderBy(desc(BookNotesTable.createdAt));
}

/**
 * Insert a book note
 */
export async function insertBookNote(
  db: DB,
  data: typeof BookNotesTable.$inferInsert,
) {
  const [note] = await db.insert(BookNotesTable).values(data).returning();
  return note;
}

/**
 * Delete a book note
 */
export async function deleteBookNote(db: DB, id: number) {
  await db.delete(BookNotesTable).where(eq(BookNotesTable.id, id));
}

/**
 * Get all book categories
 */
export async function getBookCategories(db: DB) {
  return await db
    .select()
    .from(BookCategoriesTable)
    .orderBy(asc(BookCategoriesTable.sort));
}

/**
 * Insert a book category
 */
export async function insertBookCategory(
  db: DB,
  data: typeof BookCategoriesTable.$inferInsert,
) {
  const [category] = await db
    .insert(BookCategoriesTable)
    .values(data)
    .returning();
  return category;
}

/**
 * Delete a book category (books set to null)
 */
export async function deleteBookCategory(db: DB, id: number) {
  await db.delete(BookCategoriesTable).where(eq(BookCategoriesTable.id, id));
}
