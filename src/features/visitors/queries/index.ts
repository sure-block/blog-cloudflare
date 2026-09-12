import { queryOptions } from "@tanstack/react-query";
import { getRecentVisitorsFn } from "../api/visitors.api";
import type { GetRecentVisitorsInput } from "../visitors.schema";

export const VISITORS_KEYS = {
  all: ["visitors"] as const,
  lists: ["visitors", "list"] as const,
  admin: ["visitors", "admin"] as const,
  list: (filters: GetRecentVisitorsInput = {}) => ["visitors", "list", filters] as const,
  adminList: (filters: GetRecentVisitorsInput = {}) => ["visitors", "admin", filters] as const,
};

export function VisitorsListQueryOptions(options: GetRecentVisitorsInput = {}) {
  return queryOptions({
    queryKey: VISITORS_KEYS.adminList(options),
    queryFn: async () => {
      const result = await getRecentVisitorsFn({ data: options });
      return result.data;
    },
    staleTime: 30_000,
  });
}
