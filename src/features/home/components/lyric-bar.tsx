import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getMusicFn } from "@/features/music/api/music.api";

const lyricQuery = queryOptions({
  queryKey: ["public", "music-lyric"],
  queryFn: async () => {
    const list = await getMusicFn({ data: { limit: 1 } });
    const song = list?.[0];
    if (!song?.lrc) return null;
    return { title: song.title, lrc: song.lrc };
  },
  staleTime: 5 * 60_000,
});

/** 歌词条（首页顶部滚动歌词） */
export function LyricBar() {
  const { data } = useQuery(lyricQuery);
  const [lineIndex, setLineIndex] = useState(0);
  const lines = useRef<Array<{ time: number; text: string }>>([]);

  useEffect(() => {
    if (!data?.lrc) return;
    lines.current = data.lrc
      .split("\n")
      .map((raw: string) => {
        const m = raw.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
        if (!m) return null;
        const t = Number.parseInt(m[1], 10) * 60 + Number.parseFloat(m[2]);
        return { time: t, text: m[3].trim() };
      })
      .filter((l): l is { time: number; text: string } => !!l && !!(l as {text?: string}).text);
  }, [data?.lrc]);

  useEffect(() => {
    if (lines.current.length === 0) return;
    const timer = setInterval(() => {
      setLineIndex((i) => (i + 1) % lines.current.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [data?.lrc]);

  if (!data || lines.current.length === 0) return null;

  return (
    <div className="glass-card px-5 py-3 overflow-hidden">
      <p className="text-xs text-muted-foreground truncate text-center">
        <span className="text-gradient font-medium">{data.title}</span>
        <span className="mx-2">·</span>
        {lines.current[lineIndex]?.text || ""}
      </p>
    </div>
  );
}
