/** Sure 主题文章列表骨架屏 */
export function PostsPageSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6 animate-pulse">
      <div className="glass-card p-6 md:p-8 space-y-3">
        <div className="h-8 w-40 rounded bg-slate-300/40 dark:bg-slate-700/40" />
        <div className="h-4 w-2/3 rounded bg-slate-300/30 dark:bg-slate-700/30" />
      </div>
      <div className="glass-card p-4 md:p-5 space-y-3">
        <div className="h-4 w-24 rounded bg-slate-300/40 dark:bg-slate-700/40" />
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-16 rounded-full bg-slate-300/30 dark:bg-slate-700/30"
            />
          ))}
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="glass-card p-5 md:p-6 h-28 bg-slate-300/20 dark:bg-slate-700/20"
        />
      ))}
    </div>
  );
}
