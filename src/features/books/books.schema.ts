import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import {
  BookCategoriesTable,
  BookChaptersTable,
  BookNotesTable,
  BooksTable,
  ReadingProgressTable,
} from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const BookCategorySelectSchema = createSelectSchema(BookCategoriesTable, {
  createdAt: coercedDate,
  updatedAt: coercedDate,
});
export const BookCategoryInsertSchema = createInsertSchema(BookCategoriesTable);

export const BookSelectSchema = createSelectSchema(BooksTable, {
  createdAt: coercedDate,
  updatedAt: coercedDate,
});
export const BookInsertSchema = createInsertSchema(BooksTable);
export const BookUpdateSchema = createUpdateSchema(BooksTable);

export const BookChapterSelectSchema = createSelectSchema(BookChaptersTable, {
  createdAt: coercedDate,
});
export const BookNoteSelectSchema = createSelectSchema(BookNotesTable, {
  createdAt: coercedDate,
});
export const ReadingProgressSelectSchema = createSelectSchema(
  ReadingProgressTable,
  { updatedAt: coercedDate },
);

export const BookWithChaptersSchema = BookSelectSchema.extend({
  chapters: z.array(BookChapterSelectSchema).optional(),
  category: BookCategorySelectSchema.nullable().optional(),
});

// ==================== API Input Schemas ====================
export const CreateBookInputSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().max(200).optional(),
  cover: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
  fileUrl: z.string().min(1).max(1000),
  format: z.string().max(20).optional(),
  fileSize: z.number().int().optional(),
  categoryId: z.number().int().nullable().optional(),
  sort: z.number().int().optional(),
});

export const UpdateBookInputSchema = z.object({
  id: z.number(),
  data: z.object({
    title: z.string().min(1).max(200).optional(),
    author: z.string().max(200).optional(),
    cover: z.string().max(500).optional(),
    description: z.string().max(2000).optional(),
    fileUrl: z.string().min(1).max(1000).optional(),
    format: z.string().max(20).optional(),
    fileSize: z.number().int().optional(),
    categoryId: z.number().int().nullable().optional(),
    sort: z.number().int().optional(),
  }),
});

export const DeleteBookInputSchema = z.object({
  id: z.number(),
});

export const GetBooksInputSchema = z.object({
  categorySlug: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.number().optional(),
});

export const GetBookDetailInputSchema = z.object({
  bookId: z.number(),
});

export const SaveReadingProgressInputSchema = z.object({
  bookId: z.number(),
  chapterId: z.number().nullable().optional(),
  chapterTitle: z.string().max(200).optional(),
  position: z.number().min(0).optional(),
});

export const CreateBookNoteInputSchema = z.object({
  bookId: z.number(),
  chapterId: z.number().nullable().optional(),
  text: z.string().min(1),
  note: z.string().max(2000).optional(),
  color: z.string().max(20).optional(),
  cfi: z.string().max(500).optional(),
  chapterTitle: z.string().max(200).optional(),
});

export const DeleteBookNoteInputSchema = z.object({
  id: z.number(),
});

// ==================== Types ====================
export type BookCategory = typeof BookCategoriesTable.$inferSelect;
export type Book = typeof BooksTable.$inferSelect;
export type BookChapter = typeof BookChaptersTable.$inferSelect;
export type BookNote = typeof BookNotesTable.$inferSelect;
export type ReadingProgress = typeof ReadingProgressTable.$inferSelect;
export type BookWithChapters = z.infer<typeof BookWithChaptersSchema>;
export type CreateBookInput = z.infer<typeof CreateBookInputSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookInputSchema>;
export type DeleteBookInput = z.infer<typeof DeleteBookInputSchema>;
export type GetBooksInput = z.infer<typeof GetBooksInputSchema>;
export type GetBookDetailInput = z.infer<typeof GetBookDetailInputSchema>;
export type SaveReadingProgressInput = z.infer<
  typeof SaveReadingProgressInputSchema
>;
export type CreateBookNoteInput = z.infer<typeof CreateBookNoteInputSchema>;
export type DeleteBookNoteInput = z.infer<typeof DeleteBookNoteInputSchema>;
