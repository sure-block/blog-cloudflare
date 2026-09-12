/** Sure 主题文章详情骨架屏 */
export function PostPageSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-10 pb-20 py-6 md:py-10 flex flex-col gap-6 animate-pulse">
      <div className="glass-card p-6 md:p-10 space-y-4">
        <div className="h-10 w-3/4 rounded bg-slate-300/40 dark:bg-slate-700/40" />
        <div className="h-4 w-1/2 rounded bg-slate-300/30 dark:bg-slate-700/30" />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-6 w-16 rounded-full bg-slate-300/20 dark:bg-slate-700/20"
            />
          ))}
        </div>
      </div>
      <div className="glass-card p-6 md:p-10 space-y-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-4 rounded bg-slate-300/25 dark:bg-slate-700/25"
            style={{ width: `${90 - i * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}
