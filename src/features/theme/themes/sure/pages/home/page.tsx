import { Link, useRouteContext } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { useMemo } from "react";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

/** Sure 主题主页 — 玻璃拟态个人博客首页 */
export function HomePage({ posts, pinnedPosts }: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });

  const displayPosts = useMemo(() => {
    const pinned = (pinnedPosts ?? []).map((p) => ({ ...p, isPinned: true }));
    const regular = posts.map((p) => ({ ...p, isPinned: false }));
    const seen = new Set<number>();
    const merged: Array<(typeof posts)[number] & { isPinned: boolean }> = [];
    for (const p of [...pinned, ...regular]) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p as (typeof posts)[number] & { isPinned: boolean });
      }
    }
    return merged;
  }, [posts, pinnedPosts]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6">
      {/* 第一行：个人信息卡 */}
      <section className="glass-card p-5 md:p-8 fade-in-up shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(40%_60%_at_80%_10%,rgba(129,140,248,0.12),transparent)]" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative">
          {/* 渐变头像环 */}
          <div className="gradient-ring flex-shrink-0 group hover:rotate-6 transition-transform duration-500 cursor-pointer">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden bg-white dark:bg-slate-800">
              {siteConfig.icons?.webApp192 ? (
                <img
                  src={siteConfig.icons.webApp192}
                  alt={siteConfig.author}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-gradient">
                  {siteConfig.author?.slice(0, 1)}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground tracking-tight">
              {m.home_greeting()}{" "}
              <span className="text-gradient">{siteConfig.author}</span>
            </h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* 社交链接 */}
          <div className="flex items-center gap-2 md:gap-3">
            {siteConfig.social
              ?.filter((link) => link.url)
              .slice(0, 6)
              .map((link, i) => (
                <a
                  key={`${link.platform}-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-button p-2 text-foreground/70 hover:text-foreground"
                  aria-label={link.label ?? link.platform}
                >
                  <img
                    src={link.icon}
                    alt={link.label ?? link.platform}
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* 第二行：文章列表 */}
      <section className="glass-card p-5 md:p-8 fade-in-up shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg md:text-xl font-bold text-foreground">
            {m.home_latest_posts()}
          </h2>
          <Link
            to="/posts"
            className="glass-button px-4 py-1.5 text-xs md:text-sm text-foreground/80 hover:text-foreground flex items-center gap-1"
          >
            {m.nav_posts()} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {displayPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {m.posts_no_posts()}
            </p>
          ) : (
            displayPosts.map((post) => (
              <Link
                key={post.id}
                to="/post/$slug"
                params={{ slug: post.slug }}
                className="group block glass-button !rounded-2xl px-4 md:px-5 py-4 hover-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.isPinned ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 dark:text-indigo-300 font-medium">
                          📌
                        </span>
                      ) : null}
                      <h3 className="font-medium text-foreground group-hover:text-gradient transition-all line-clamp-1">
                        {post.title}
                      </h3>
                    </div>
                    {post.summary ? (
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1">
                        {post.summary}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
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
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
