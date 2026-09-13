import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { FileText, Heart, Image, MessageSquare } from "lucide-react";
import { getAlbumsFn } from "@/features/albums/api/albums.api";
import { getChattersFn } from "@/features/chatters/api/chatters.api";

const chattersCountQuery = queryOptions({
  queryKey: ["public", "chatters-count"],
  queryFn: async () => {
    const result = await getChattersFn({
      data: { limit: 1, status: "published" },
    });
    return result.items?.length ?? 0;
  },
  staleTime: 5 * 60_000,
});

const albumsCountQuery = queryOptions({
  queryKey: ["public", "albums-count"],
  queryFn: async () => {
    const list = await getAlbumsFn({ data: { limit: 1 } });
    return list?.length ?? 0;
  },
  staleTime: 5 * 60_000,
});

/** 站点统计面板 */
export function SiteDashboard({ postCount }: { postCount: number }) {
  const { data: chatterCount } = useQuery(chattersCountQuery);
  const { data: albumCount } = useQuery(albumsCountQuery);

  const stats = [
    {
      icon: FileText,
      label: "文章",
      value: postCount,
      color: "text-indigo-400",
    },
    {
      icon: MessageSquare,
      label: "说说",
      value: chatterCount ?? 0,
      color: "text-pink-400",
    },
    {
      icon: Image,
      label: "相册",
      value: albumCount ?? 0,
      color: "text-emerald-400",
    },
    {
      icon: Heart,
      label: "运行",
      value: Math.max(1, Math.floor((Date.now() - Date.now() - 0) / 86400000) + 1),
      color: "text-amber-400",
      suffix: "天",
    },
  ];

  return (
    <div className="glass-card p-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/30 dark:bg-white/5"
          >
            <div className={`p-2 rounded-lg bg-white/40 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-xl font-serif font-medium text-foreground">
                {s.value}
                {s.suffix ? (
                  <span className="text-xs text-muted-foreground ml-1">
                    {s.suffix}
                  </span>
                ) : null}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
