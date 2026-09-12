import { Suspense, lazy, useEffect, useState } from "react";

const StarsScene = lazy(() =>
  import("./stars-scene").then((m) => ({
    // 原文件是默认导出还是命名导出？
    default: (m as any).default ?? (m as any).StarsScene,
  })),
);

/** 星港 — 3D 太阳系（仅客户端） */
export function StarsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground font-serif italic">
        加载星港中...
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-muted-foreground font-serif italic">
          加载星港中...
        </div>
      }
    >
      <StarsScene />
    </Suspense>
  );
}
