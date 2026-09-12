import { queryOptions } from "@tanstack/react-query";
import { getCategoriesFn } from "../api/categories.api";
import type { GetCategoriesInput } from "../categories.schema";

export const CATEGORIES_KEYS = {
  all: ["categories"] as const,
  lists: ["categories", "list"] as const,
  admin: ["categories", "admin"] as const,
  list: (filters: GetCategoriesInput = {}) => ["categories", "list", filters] as const,
  adminList: (filters: GetCategoriesInput = {}) => ["categories", "admin", filters] as const,
};

export function CategoriesListQueryOptions(options: GetCategoriesInput = {}) {
  return queryOptions({
    queryKey: CATEGORIES_KEYS.adminList(options),
    queryFn: () => getCategoriesFn({ data: options }),
    staleTime: 30_000,
  });
}
