import { Link, useRouteContext } from "@tanstack/react-router";
import { CalendarDays, Clock3, TagIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PostsPageProps } from "@/features/theme/contract/pages";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export const INITIAL_TAG_COUNT = 10;

/** Sure 主题文章列表页 — 玻璃拟态 */
export function PostsPage({
  posts,
  tags,
  selectedTag,
  onTagClick,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostsPageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreTags = tags.length > INITIAL_TAG_COUNT;
  const visibleTags = isExpanded ? tags : tags.slice(0, INITIAL_TAG_COUNT);

  // Infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "0px" },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6">
      {/* Header */}
      <header className="glass-card p-6 md:p-8 fade-in-up shadow-xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          {m.nav_posts()}
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          {siteConfig.description}
        </p>
      </header>

      {/* Tag Filters */}
      <section className="glass-card p-4 md:p-5 fade-in-up shadow-lg">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <TagIcon size={14} />
          <span>{m.posts_tags_filter()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTagClick(undefined)}
            className={cn(
              "glass-button px-4 py-1.5 text-sm rounded-full",
              selectedTag === undefined &&
                "!bg-indigo-500/25 !text-indigo-600 dark:!text-indigo-300",
            )}
          >
            {m.posts_all()}
          </button>
          {visibleTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagClick(tag.name)}
              className={cn(
                "glass-button px-4 py-1.5 text-sm rounded-full",
                selectedTag === tag.name &&
                  "!bg-indigo-500/25 !text-indigo-600 dark:!text-indigo-300",
              )}
            >
              {tag.name}
              <span className="ml-1.5 text-xs text-muted-foreground">
                {tag.postCount}
              </span>
            </button>
          ))}
          {hasMoreTags && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="glass-button px-4 py-1.5 text-sm rounded-full text-muted-foreground"
            >
              {isExpanded ? m.tags_collapse() : m.tags_expand()}
            </button>
          )}
        </div>
      </section>

      {/* Posts List */}
      <section className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            {m.posts_no_posts()}
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to="/post/$slug"
              params={{ slug: post.slug }}
              className="group glass-card p-5 md:p-6 hover-lift shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-lg text-foreground group-hover:text-gradient transition-all line-clamp-1">
                    {post.title}
                  </h2>
                  {post.summary ? (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {post.summary}
                    </p>
                  ) : null}
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={12} />
                      {post.readTimeInMinutes}m
                    </span>
                    {post.tags && post.tags.length > 0 ? (
                      <span className="flex items-center gap-1.5 flex-wrap">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 text-[10px]"
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}

        {/* Infinite scroll sentinel */}
        <div ref={observerRef} className="h-4" />
        {isFetchingNextPage && (
          <div className="glass-card p-6 text-center text-sm text-muted-foreground animate-pulse">
            {m.posts_loading()}
          </div>
        )}
      </section>
    </div>
  );
}
