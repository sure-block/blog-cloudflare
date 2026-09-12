import { queryOptions } from "@tanstack/react-query";
import { getProjectsFn } from "../api/projects.api";
import type { GetProjectsInput } from "../projects.schema";

export const PROJECTS_KEYS = {
  all: ["projects"] as const,
  lists: ["projects", "list"] as const,
  admin: ["projects", "admin"] as const,
  list: (filters: GetProjectsInput = {}) => ["projects", "list", filters] as const,
  adminList: (filters: GetProjectsInput = {}) => ["projects", "admin", filters] as const,
};

export function ProjectsListQueryOptions(options: GetProjectsInput = {}) {
  return queryOptions({
    queryKey: PROJECTS_KEYS.adminList(options),
    queryFn: () => getProjectsFn({ data: options }),
    staleTime: 30_000,
  });
}
