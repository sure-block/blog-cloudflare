import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Camera, X } from "lucide-react";
import { useState } from "react";
import { getAlbumsFn } from "@/features/albums/api/albums.api";

const albumsQuery = queryOptions({
  queryKey: ["public", "photowall"],
  queryFn: async () => {
    return await getAlbumsFn({ data: { limit: 100, withPhotos: true } });
  },
  staleTime: 5 * 60_000,
});

interface Photo {
  id: number;
  url: string;
  caption: string | null;
}

/** 照片墙页 */
export function PhotoWallPage() {
  const { data: albums = [], isLoading } = useQuery(albumsQuery);
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground font-serif italic">
        加载中...
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <Camera className="text-indigo-400" size={28} />
          照片墙
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          共 {albums.length} 个相册
        </p>
      </header>

      {albums.length === 0 ? (
        <div className="glass-card py-20 text-center text-muted-foreground">
          暂无相册
        </div>
      ) : (
        <div className="space-y-8">
          {albums.map((album) => {
            const photos = (album as { photos?: Photo[] }).photos ?? [];
            return (
              <section key={album.id} className="glass-card p-5 md:p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-serif text-lg font-medium text-foreground">
                    {album.title}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {photos.length} 张
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setLightbox({ photos, index: i })}
                      className="aspect-square rounded-lg overflow-hidden bg-muted/20 hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption ?? ""}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
            aria-label="关闭"
          >
            <X size={28} />
          </button>
          <img
            src={lightbox.photos[lightbox.index].url}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
