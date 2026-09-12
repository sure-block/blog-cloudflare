import { queryOptions } from "@tanstack/react-query";
import { getAllMessagesFn } from "../api/messages.api";
import type { GetMessagesInput } from "../messages.schema";

export const MESSAGES_KEYS = {
  all: ["messages"] as const,
  lists: ["messages", "list"] as const,
  admin: ["messages", "admin"] as const,
  list: (filters: GetMessagesInput = {}) => ["messages", "list", filters] as const,
  adminList: (filters: GetMessagesInput = {}) => ["messages", "admin", filters] as const,
};

export function MessagesListQueryOptions() {
  return queryOptions({
    queryKey: MESSAGES_KEYS.adminList({}),
    queryFn: () => getAllMessagesFn(),
    staleTime: 30_000,
  });
}
