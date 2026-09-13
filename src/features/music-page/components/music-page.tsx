import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Music, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getMusicFn } from "@/features/music/api/music.api";

const musicQuery = queryOptions({
  queryKey: ["public", "music-page"],
  queryFn: async () => {
    return await getMusicFn({ data: { limit: 100 } });
  },
  staleTime: 5 * 60_000,
});

/** 音乐列表页 */
export function MusicPage() {
  const { data: songs = [], isLoading } = useQuery(musicQuery);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current || current === null) return;
    audioRef.current.load();
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [current]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [playing]);

  const toggle = (i: number) => {
    if (current === i) {
      setPlaying(!playing);
    } else {
      setCurrent(i);
      setPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <Music className="text-indigo-400" size={28} />
          音乐
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          共 {songs.length} 首
        </p>
      </header>

      {isLoading ? (
        <p className="py-20 text-center text-muted-foreground">加载中...</p>
      ) : songs.length === 0 ? (
        <div className="glass-card py-20 text-center text-muted-foreground">
          暂无音乐
        </div>
      ) : (
        <div className="glass-card divide-y divide-border/20">
          {songs.map((song, i) => (
            <button
              key={song.id}
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/30 dark:hover:bg-white/5 transition-colors text-left"
            >
              {song.cover ? (
                <img
                  src={song.cover}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                  <Music size={18} className="text-white/80" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {song.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {song.artist || "未知"}
                </p>
              </div>
              {current === i && playing ? (
                <Pause size={16} className="text-indigo-400" />
              ) : (
                <Play size={16} className="text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      )}

      {current !== null && songs[current] ? (
        <audio
          ref={audioRef}
          src={songs[current].src}
          onEnded={() => setCurrent((c) => (c === null ? null : (c + 1) % songs.length))}
        />
      ) : null}
    </div>
  );
}
