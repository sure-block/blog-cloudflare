import { queryOptions } from "@tanstack/react-query";
import { getLoginLogsFn } from "../api/login-logs.api";
import type { GetLoginLogsInput } from "../login-logs.schema";

export const LOGIN_LOGS_KEYS = {
  all: ["login-logs"] as const,
  lists: ["login-logs", "list"] as const,
  admin: ["login-logs", "admin"] as const,
  list: (filters: GetLoginLogsInput = {}) => ["login-logs", "list", filters] as const,
  adminList: (filters: GetLoginLogsInput = {}) => ["login-logs", "admin", filters] as const,
};

export function LoginLogsListQueryOptions(options: GetLoginLogsInput = {}) {
  return queryOptions({
    queryKey: LOGIN_LOGS_KEYS.adminList(options),
    queryFn: async () => {
      const result = await getLoginLogsFn({ data: options });
      return result.data;
    },
    staleTime: 30_000,
  });
}
