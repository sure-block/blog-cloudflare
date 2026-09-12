/** Sure 主题友链页骨架屏 */
export function FriendLinksPageSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6 animate-pulse">
      <div className="glass-card p-6 md:p-10 space-y-3">
        <div className="h-9 w-40 rounded bg-slate-300/40 dark:bg-slate-700/40" />
        <div className="h-4 w-2/3 rounded bg-slate-300/30 dark:bg-slate-700/30" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-card p-5 h-20 bg-slate-300/20 dark:bg-slate-700/20" />
        ))}
      </div>
    </div>
  );
}
