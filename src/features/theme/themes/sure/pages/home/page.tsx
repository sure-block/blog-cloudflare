import { Link, useRouteContext } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { useMemo } from "react";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import {
  CloudPlayer,
  DogDiary,
  LatestChatterCarousel,
  LyricBar,
  PhotoWallPreview,
  SiteDashboard,
} from "@/features/home/components";

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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-4 md:gap-6">
      {/* 第一行：个人信息卡 + 网易云播放器 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <section className="md:col-span-8 glass-card p-5 md:p-8 fade-in-up shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(40%_60%_at_80%_10%,rgba(129,140,248,0.12),transparent)]" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative">
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

        <div className="md:col-span-4 fade-in-up">
          <CloudPlayer />
        </div>
      </div>

      {/* 歌词条 */}
      <LyricBar />

      {/* 第二行：照片墙 + 文章/说说/舔狗日记 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <div className="md:col-span-4">
          <PhotoWallPreview />
        </div>

        <div className="md:col-span-8 flex flex-col gap-4 md:gap-6">
          {/* 最新文章 */}
          <section className="glass-card p-5 md:p-6 fade-in-up shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-base md:text-lg font-medium text-foreground">
                {m.home_latest_posts()}
              </h2>
              <Link
                to="/posts"
                className="glass-button px-3 py-1 text-xs text-foreground/80 hover:text-foreground flex items-center gap-1"
              >
                {m.nav_posts()} <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2">
              {displayPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  {m.posts_no_posts()}
                </p>
              ) : (
                displayPosts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    to="/post/$slug"
                    params={{ slug: post.slug }}
                    className="group block glass-button !rounded-xl px-3 md:px-4 py-3 hover-lift"
                  >
                    <div className="flex items-center gap-3">
                      {post.isPinned ? (
                        <span className="text-xs">📌</span>
                      ) : null}
                      <h3 className="flex-1 text-sm font-medium text-foreground group-hover:text-gradient transition-all line-clamp-1">
                        {post.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <CalendarDays size={11} />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Clock3 size={11} />
                        {post.readTimeInMinutes}m
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* 说说轮播 + 舔狗日记 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1">
            <div className="md:col-span-8">
              <LatestChatterCarousel />
            </div>
            <div className="md:col-span-4">
              <DogDiary />
            </div>
          </div>
        </div>
      </div>

      {/* 站点统计 */}
      <SiteDashboard postCount={posts.length + (pinnedPosts?.length ?? 0)} />
    </div>
  );
}
