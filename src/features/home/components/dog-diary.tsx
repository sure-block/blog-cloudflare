import { Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DogDiary {
  content?: string;
  text?: string;
}

/** 舔狗日记（首页侧栏） */
export function DogDiary() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOne = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://v2.xxapi.cn/api/tiangou", {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as DogDiary;
      setText(data.content || data.text || "");
    } catch {
      setText("今天也想你了，但是你不会知道。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return (
    <div className="glass-card h-full p-5 flex flex-col">
      <h3 className="font-serif text-base font-medium text-foreground mb-3 flex items-center gap-2">
        <Heart size={16} className="text-red-400" />
        舔狗日记
      </h3>
      <div className="flex-1 flex flex-col justify-center min-h-[120px]">
        {loading ? (
          <p className="text-xs text-muted-foreground animate-pulse">
            正在写日记...
          </p>
        ) : (
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-6">
            {text}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={fetchOne}
        className="glass-button mt-3 self-end text-xs px-3 py-1"
      >
        换一篇
      </button>
    </div>
  );
}
