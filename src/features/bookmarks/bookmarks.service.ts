import * as BookmarkRepo from "@/features/bookmarks/data/bookmarks.data";
import type {
  CreateBookmarkCategoryInput,
  CreateBookmarkSiteInput,
  DeleteBookmarkCategoryInput,
  DeleteBookmarkSiteInput,
  GetBookmarksInput,
  UpdateBookmarkCategoryInput,
  UpdateBookmarkSiteInput,
} from "@/features/bookmarks/bookmarks.schema";
import { err, ok } from "@/lib/errors";

/**
 * Get bookmark categories with sites
 */
export async function getBookmarks(
  context: DbContext,
  data: GetBookmarksInput = {},
) {
  const { withSites } = data;
  return await BookmarkRepo.getBookmarkCategories(context.db, { withSites });
}

/**
 * Create a bookmark category
 */
export async function createBookmarkCategory(
  context: DbContext,
  data: CreateBookmarkCategoryInput,
) {
  const category = await BookmarkRepo.insertBookmarkCategory(context.db, {
    name: data.name,
    icon: data.icon ?? "",
    description: data.description ?? "",
    sort: data.sort ?? 0,
  });
  return ok(category);
}

/**
 * Update a bookmark category
 */
export async function updateBookmarkCategory(
  context: DbContext,
  data: UpdateBookmarkCategoryInput,
) {
  const existing = await BookmarkRepo.findBookmarkCategoryById(
    context.db,
    data.id,
  );
  if (!existing) {
    return err({ reason: "BOOKMARK_CATEGORY_NOT_FOUND" });
  }
  const category = await BookmarkRepo.updateBookmarkCategory(
    context.db,
    data.id,
    data.data,
  );
  return ok(category);
}

/**
 * Delete a bookmark category
 */
export async function deleteBookmarkCategory(
  context: DbContext,
  data: DeleteBookmarkCategoryInput,
) {
  const existing = await BookmarkRepo.findBookmarkCategoryById(
    context.db,
    data.id,
  );
  if (!existing) {
    return err({ reason: "BOOKMARK_CATEGORY_NOT_FOUND" });
  }
  await BookmarkRepo.deleteBookmarkCategory(context.db, data.id);
  return ok({ success: true });
}

/**
 * Create a bookmark site
 */
export async function createBookmarkSite(
  context: DbContext,
  data: CreateBookmarkSiteInput,
) {
  const category = await BookmarkRepo.findBookmarkCategoryById(
    context.db,
    data.categoryId,
  );
  if (!category) {
    return err({ reason: "BOOKMARK_CATEGORY_NOT_FOUND" });
  }
  const site = await BookmarkRepo.insertBookmarkSite(context.db, {
    categoryId: data.categoryId,
    name: data.name,
    url: data.url,
    icon: data.icon ?? "",
    description: data.description ?? "",
    platforms: data.platforms ?? [],
    sort: data.sort ?? 0,
  });
  return ok(site);
}

/**
 * Update a bookmark site
 */
export async function updateBookmarkSite(
  context: DbContext,
  data: UpdateBookmarkSiteInput,
) {
  const existing = await BookmarkRepo.findBookmarkSiteById(context.db, data.id);
  if (!existing) {
    return err({ reason: "BOOKMARK_SITE_NOT_FOUND" });
  }
  const site = await BookmarkRepo.updateBookmarkSite(
    context.db,
    data.id,
    data.data,
  );
  return ok(site);
}

/**
 * Delete a bookmark site
 */
export async function deleteBookmarkSite(
  context: DbContext,
  data: DeleteBookmarkSiteInput,
) {
  const existing = await BookmarkRepo.findBookmarkSiteById(context.db, data.id);
  if (!existing) {
    return err({ reason: "BOOKMARK_SITE_NOT_FOUND" });
  }
  await BookmarkRepo.deleteBookmarkSite(context.db, data.id);
  return ok({ success: true });
}
