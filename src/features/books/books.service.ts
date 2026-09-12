import * as BookRepo from "@/features/books/data/books.data";
import type {
  CreateBookInput,
  CreateBookNoteInput,
  DeleteBookInput,
  DeleteBookNoteInput,
  GetBooksInput,
  SaveReadingProgressInput,
  UpdateBookInput,
} from "@/features/books/books.schema";
import { err, ok } from "@/lib/errors";

/**
 * Get books (public library)
 */
export async function getBooks(context: DbContext, data: GetBooksInput = {}) {
  const { categorySlug, limit, cursor } = data;
  return await BookRepo.getBooks(context.db, { categorySlug, limit, cursor });
}

/**
 * Get book detail with chapters (bumps view count)
 */
export async function getBook(context: DbContext, id: number) {
  const book = await BookRepo.findBookById(context.db, id);
  if (!book) {
    return err({ reason: "BOOK_NOT_FOUND" });
  }
  // Async fire-and-forget view increment
  void BookRepo.incrementBookViews(context.db, id);
  return ok(book);
}

/**
 * Create a book
 */
export async function createBook(context: DbContext, data: CreateBookInput) {
  const book = await BookRepo.insertBook(context.db, {
    title: data.title,
    author: data.author ?? "",
    cover: data.cover ?? "",
    description: data.description ?? "",
    fileUrl: data.fileUrl,
    format: data.format ?? "",
    fileSize: data.fileSize ?? 0,
    categoryId: data.categoryId ?? null,
    sort: data.sort ?? 0,
  });
  return ok(book);
}

/**
 * Update a book
 */
export async function updateBook(context: DbContext, data: UpdateBookInput) {
  const existing = await BookRepo.findBookByIdAdmin(context.db, data.id);
  if (!existing) {
    return err({ reason: "BOOK_NOT_FOUND" });
  }
  const book = await BookRepo.updateBook(context.db, data.id, data.data);
  return ok(book);
}

/**
 * Delete a book
 */
export async function deleteBook(context: DbContext, data: DeleteBookInput) {
  const existing = await BookRepo.findBookByIdAdmin(context.db, data.id);
  if (!existing) {
    return err({ reason: "BOOK_NOT_FOUND" });
  }
  await BookRepo.deleteBook(context.db, data.id);
  return ok({ success: true });
}

/**
 * Save reading progress
 */
export async function saveReadingProgress(
  context: DbContext,
  data: SaveReadingProgressInput,
) {
  const progress = await BookRepo.upsertReadingProgress(context.db, {
    bookId: data.bookId,
    chapterId: data.chapterId ?? null,
    chapterTitle: data.chapterTitle ?? "",
    position: data.position ?? 0,
  });
  return ok(progress);
}

/**
 * Get reading progress
 */
export async function getReadingProgress(context: DbContext, bookId: number) {
  const progress = await BookRepo.getReadingProgress(context.db, bookId);
  return ok(progress);
}

/**
 * Create a book note
 */
export async function createBookNote(
  context: DbContext,
  data: CreateBookNoteInput,
) {
  const book = await BookRepo.findBookByIdAdmin(context.db, data.bookId);
  if (!book) {
    return err({ reason: "BOOK_NOT_FOUND" });
  }
  const note = await BookRepo.insertBookNote(context.db, {
    bookId: data.bookId,
    chapterId: data.chapterId ?? null,
    text: data.text,
    note: data.note ?? "",
    color: data.color ?? "",
    cfi: data.cfi ?? "",
    chapterTitle: data.chapterTitle ?? "",
  });
  return ok(note);
}

/**
 * Get notes for a book
 */
export async function getBookNotes(context: DbContext, bookId: number) {
  return await BookRepo.getNotesByBookId(context.db, bookId);
}

/**
 * Delete a book note
 */
export async function deleteBookNote(
  context: DbContext,
  data: DeleteBookNoteInput,
) {
  await BookRepo.deleteBookNote(context.db, data.id);
  return ok({ success: true });
}

/**
 * Get book categories
 */
export async function getBookCategories(context: DbContext) {
  return await BookRepo.getBookCategories(context.db);
}
