import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Music, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getMusicFn } from "@/features/music/api/music.api";

/** 音乐列表查询 */
const musicQuery = queryOptions({
  queryKey: ["public", "music"],
  queryFn: async () => {
    return await getMusicFn({ data: { limit: 50 } });
  },
  staleTime: 5 * 60_000,
});

/** 网易云播放器（简化版，HTML5 audio） */
export function CloudPlayer() {
  const { data: songs = [] } = useQuery(musicQuery);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const song = songs[index];

  useEffect(() => {
    if (!audioRef.current || !song?.src) return;
    audioRef.current.load();
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    }
  }, [index, song?.src]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  if (!song) {
    return (
      <div className="glass-card h-full min-h-[180px] p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <Music size={28} className="opacity-30" />
        <p className="text-xs">暂无音乐，去后台添加</p>
      </div>
    );
  }

  const next = () => setIndex((i) => (i + 1) % songs.length);
  const prev = () => setIndex((i) => (i - 1 + songs.length) % songs.length);

  return (
    <div className="glass-card h-full p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {song.cover ? (
          <img
            src={song.cover}
            alt={song.title}
            className="w-16 h-16 rounded-lg object-cover border border-white/20 shadow-lg shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
            <Music size={24} className="text-white/80" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground truncate">
            {song.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {song.artist || "未知艺术家"}
          </p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={song.src}
        onEnded={next}
        preload="none"
      />

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          className="glass-button p-2"
          aria-label="上一首"
        >
          <SkipBack size={16} />
        </button>
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          className="glass-button p-3 !rounded-full"
          aria-label={playing ? "暂停" : "播放"}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          onClick={next}
          className="glass-button p-2"
          aria-label="下一首"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
