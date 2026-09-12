import { queryOptions } from "@tanstack/react-query";
import { getAlbumsFn } from "../api/albums.api";
import type { GetAlbumsInput } from "../albums.schema";

export const ALBUMS_KEYS = {
  all: ["albums"] as const,
  lists: ["albums", "list"] as const,
  admin: ["albums", "admin"] as const,
  list: (filters: GetAlbumsInput = {}) => ["albums", "list", filters] as const,
  adminList: (filters: GetAlbumsInput = {}) => ["albums", "admin", filters] as const,
};

export function AlbumsListQueryOptions(options: GetAlbumsInput = {}) {
  return queryOptions({
    queryKey: ALBUMS_KEYS.adminList(options),
    queryFn: () => getAlbumsFn({ data: options }),
    staleTime: 30_000,
  });
}
