import { queryOptions } from "@tanstack/react-query";
import { getMusicFn } from "../api/music.api";
import type { GetMusicInput } from "../music.schema";

export const MUSIC_KEYS = {
  all: ["music"] as const,
  lists: ["music", "list"] as const,
  admin: ["music", "admin"] as const,
  list: (filters: GetMusicInput = {}) => ["music", "list", filters] as const,
  adminList: (filters: GetMusicInput = {}) => ["music", "admin", filters] as const,
};

export function MusicListQueryOptions(options: GetMusicInput = {}) {
  return queryOptions({
    queryKey: MUSIC_KEYS.adminList(options),
    queryFn: () => getMusicFn({ data: options }),
    staleTime: 30_000,
  });
}
