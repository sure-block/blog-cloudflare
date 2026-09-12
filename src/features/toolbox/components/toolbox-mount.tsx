import { lazy, Suspense, useEffect, useState } from "react";

const Toolbox = lazy(() =>
  import("./toolbox").then((m) => ({ default: m.default })),
);
const GamesPanel = lazy(() =>
  import("./games-panel").then((m) => ({ default: m.default })),
);

/** 悬浮工具箱挂载点 — 仅客户端渲染（依赖 window/localStorage） */
export function ToolboxMount() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <Toolbox />
      <GamesPanel />
    </Suspense>
  );
}
