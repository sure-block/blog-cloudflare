import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { getAlbumsFn } from "@/features/albums/api/albums.api";

const albumsQuery = queryOptions({
  queryKey: ["public", "albums"],
  queryFn: async () => {
    return await getAlbumsFn({ data: { limit: 6 } });
  },
  staleTime: 5 * 60_000,
});

/** 照片墙预览（首页侧栏） */
export function PhotoWallPreview() {
  const { data: albums = [], isLoading } = useQuery(albumsQuery);

  return (
    <div className="glass-card h-full p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-base font-medium text-foreground flex items-center gap-2">
          <Camera size={16} className="text-indigo-400" />
          相册
        </h3>
        <a
          href="/albums"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          查看全部 →
        </a>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground py-8 text-center">加载中...</p>
      ) : albums.length === 0 ? (
        <p className="text-xs text-muted-foreground py-8 text-center">
          暂无相册
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 flex-1">
          {albums.slice(0, 6).map((album) => (
            <div
              key={album.id}
              className="aspect-square rounded-lg overflow-hidden bg-muted/20 relative group"
            >
              {album.cover ? (
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                  <Camera size={20} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                <p className="text-[10px] text-white truncate">{album.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
