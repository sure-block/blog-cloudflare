/** Sure 主题主页骨架屏 — 玻璃卡片占位 */
export function HomePageSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6">
      {/* 个人信息卡骨架 */}
      <div className="glass-card p-5 md:p-8 animate-pulse">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-300/40 dark:bg-slate-700/40" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-1/2 rounded bg-slate-300/40 dark:bg-slate-700/40" />
            <div className="h-4 w-3/4 rounded bg-slate-300/30 dark:bg-slate-700/30" />
          </div>
        </div>
      </div>

      {/* 文章列表骨架 */}
      <div className="glass-card p-5 md:p-8 animate-pulse space-y-4">
        <div className="h-5 w-32 rounded bg-slate-300/40 dark:bg-slate-700/40" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 rounded-2xl bg-slate-300/30 dark:bg-slate-700/30"
          />
        ))}
      </div>
    </div>
  );
}
