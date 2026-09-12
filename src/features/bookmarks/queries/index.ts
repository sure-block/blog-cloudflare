import { queryOptions } from "@tanstack/react-query";
import { getBookmarksFn } from "../api/bookmarks.api";
import type { GetBookmarksInput } from "../bookmarks.schema";

export const BOOKMARKS_KEYS = {
  all: ["bookmarks"] as const,
  lists: ["bookmarks", "list"] as const,
  admin: ["bookmarks", "admin"] as const,
  list: (filters: GetBookmarksInput = {}) => ["bookmarks", "list", filters] as const,
  adminList: (filters: GetBookmarksInput = {}) => ["bookmarks", "admin", filters] as const,
};

export function BookmarksListQueryOptions(options: GetBookmarksInput = {}) {
  return queryOptions({
    queryKey: BOOKMARKS_KEYS.adminList(options),
    queryFn: () => getBookmarksFn({ data: options }),
    staleTime: 30_000,
  });
}
