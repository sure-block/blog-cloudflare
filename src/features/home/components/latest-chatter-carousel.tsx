import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Heart, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getChattersFn } from "@/features/chatters/api/chatters.api";

const chattersQuery = queryOptions({
  queryKey: ["public", "chatters-latest"],
  queryFn: async () => {
    const result = await getChattersFn({
      data: { limit: 5, status: "published" },
    });
    return result.items ?? [];
  },
  staleTime: 60_000,
});

/** 最新说说轮播 */
export function LatestChatterCarousel() {
  const { data: chatters = [] } = useQuery(chattersQuery);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (chatters.length <= 1) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % chatters.length),
      5000,
    );
    return () => clearInterval(t);
  }, [chatters.length]);

  if (chatters.length === 0) {
    return (
      <div className="glass-card h-full p-5 flex items-center justify-center text-xs text-muted-foreground">
        暂无说说
      </div>
    );
  }

  const c = chatters[index];

  return (
    <div className="glass-card h-full p-5 flex flex-col">
      <h3 className="font-serif text-base font-medium text-foreground mb-3 flex items-center gap-2">
        <MessageSquare size={16} className="text-pink-400" />
        最新说说
      </h3>
      <div className="flex-1 flex flex-col justify-center min-h-[120px]">
        <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
          {c.content}
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          {c.mood ? <span className="text-pink-400">{c.mood}</span> : null}
          <span className="flex items-center gap-1">
            <Heart size={12} /> {c.likes ?? 0}
          </span>
          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {chatters.length > 1 ? (
        <div className="flex gap-1.5 mt-3 justify-center">
          {chatters.map((_, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === index ? "bg-indigo-400 w-4" : "bg-muted-foreground/30"
              }`}
              aria-label={`第 ${i + 1} 条`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
