import { createServerFn } from "@tanstack/react-start";
import * as BookService from "@/features/books/books.service";
import {
  CreateBookInputSchema,
  CreateBookNoteInputSchema,
  DeleteBookInputSchema,
  DeleteBookNoteInputSchema,
  GetBookDetailInputSchema,
  GetBooksInputSchema,
  SaveReadingProgressInputSchema,
  UpdateBookInputSchema,
} from "@/features/books/books.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

// ============ Public API ============

/** 公开：图书列表 */
export const getBooksFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetBooksInputSchema)
  .handler(async ({ data, context }) => {
    return await BookService.getBooks(context, data);
  });

/** 公开：图书详情（含章节） */
export const getBookFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetBookDetailInputSchema)
  .handler(async ({ data, context }) => {
    return await BookService.getBook(context, data.bookId);
  });

/** 公开：图书分类 */
export const getBookCategoriesFn = createServerFn()
  .middleware([dbMiddleware])
  .handler(async ({ context }) => {
    return await BookService.getBookCategories(context);
  });

/** 公开：保存阅读进度 */
export const saveReadingProgressFn = createServerFn({
  method: "POST",
})
  .middleware([dbMiddleware])
  .inputValidator(SaveReadingProgressInputSchema)
  .handler(({ data, context }) =>
    BookService.saveReadingProgress(context, data),
  );

/** 公开：获取阅读进度 */
export const getReadingProgressFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetBookDetailInputSchema)
  .handler(async ({ data, context }) => {
    return await BookService.getReadingProgress(context, data.bookId);
  });

/** 公开：图书笔记列表 */
export const getBookNotesFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetBookDetailInputSchema)
  .handler(async ({ data, context }) => {
    return await BookService.getBookNotes(context, data.bookId);
  });

/** 公开：添加图书笔记 */
export const createBookNoteFn = createServerFn({
  method: "POST",
})
  .middleware([dbMiddleware])
  .inputValidator(CreateBookNoteInputSchema)
  .handler(({ data, context }) => BookService.createBookNote(context, data));

// ============ Admin API ============

/** 管理端：创建图书 */
export const createBookFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateBookInputSchema)
  .handler(({ data, context }) => BookService.createBook(context, data));

/** 管理端：更新图书 */
export const updateBookFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateBookInputSchema)
  .handler(({ data, context }) => BookService.updateBook(context, data));

/** 管理端：删除图书 */
export const deleteBookFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteBookInputSchema)
  .handler(({ data, context }) => BookService.deleteBook(context, data));

/** 管理端：删除图书笔记 */
export const deleteBookNoteFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteBookNoteInputSchema)
  .handler(({ data, context }) => BookService.deleteBookNote(context, data));
