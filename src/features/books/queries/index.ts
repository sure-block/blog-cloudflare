import { queryOptions } from "@tanstack/react-query";
import { getBooksFn } from "../api/books.api";
import type { GetBooksInput } from "../books.schema";

export const BOOKS_KEYS = {
  all: ["books"] as const,
  lists: ["books", "list"] as const,
  admin: ["books", "admin"] as const,
  list: (filters: GetBooksInput = {}) => ["books", "list", filters] as const,
  adminList: (filters: GetBooksInput = {}) => ["books", "admin", filters] as const,
};

export function BooksListQueryOptions(options: GetBooksInput = {}) {
  return queryOptions({
    queryKey: BOOKS_KEYS.adminList(options),
    queryFn: () => getBooksFn({ data: options }),
    staleTime: 30_000,
  });
}
