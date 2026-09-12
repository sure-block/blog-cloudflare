import { queryOptions } from "@tanstack/react-query";
import { getAllChattersFn } from "../api/chatters.api";
import type { GetChattersInput } from "../chatters.schema";

export const CHATTERS_KEYS = {
  all: ["chatters"] as const,
  lists: ["chatters", "list"] as const,
  admin: ["chatters", "admin"] as const,
  list: (filters: GetChattersInput = {}) => ["chatters", "list", filters] as const,
  adminList: (filters: GetChattersInput = {}) => ["chatters", "admin", filters] as const,
};

export function ChattersListQueryOptions() {
  return queryOptions({
    queryKey: CHATTERS_KEYS.adminList({}),
    queryFn: () => getAllChattersFn(),
    staleTime: 30_000,
  });
}
