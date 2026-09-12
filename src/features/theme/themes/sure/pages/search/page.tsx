import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import type { SearchPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

/** Sure 主题搜索页 — 玻璃拟态 */
export function SearchPage({
  query,
  results,
  isSearching,
  onQueryChange,
  onSelectPost,
  onBack,
}: SearchPageProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6">
      <button
        onClick={onBack}
        className="glass-button px-4 py-2 text-sm text-foreground/70 hover:text-foreground self-start flex items-center gap-2"
      >
        <ArrowLeft size={14} />
        {m.search_back()}
      </button>

      <div className="glass-card p-6 md:p-8 fade-in-up shadow-2xl">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-6">
          {m.nav_search()}
        </h1>

        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={m.search_placeholder()}
            className="glass-input w-full pl-11 text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="mt-6 space-y-3">
          {isSearching ? (
            <div className="text-center py-10 text-sm text-muted-foreground animate-pulse">
              {m.posts_loading()}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              {m.search_no_results()}
            </div>
          ) : (
            results.map((result) => (
              <button
                key={result.post.id}
                onClick={() => onSelectPost(result.post.slug)}
                className="w-full text-left glass-button !rounded-2xl px-5 py-4 hover-lift"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-foreground line-clamp-1">
                    {result.post.title}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {Math.round(result.score * 100)}%
                  </span>
                </div>
                {result.post.summary && (
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {result.post.summary}
                  </p>
                )}
                {result.post.tags.length > 0 && (
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {result.post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
