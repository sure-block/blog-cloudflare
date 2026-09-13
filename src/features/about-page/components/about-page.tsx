import { useRouteContext } from "@tanstack/react-router";
import { User } from "lucide-react";

/** 关于页 */
export function AboutPage() {
  const { siteConfig } = useRouteContext({ from: "__root__" });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <User className="text-indigo-400" size={28} />
          关于
        </h1>
      </header>

      <section className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-5 mb-6">
          {siteConfig.icons?.webApp192 ? (
            <img
              src={siteConfig.icons.webApp192}
              alt={siteConfig.author}
              className="w-20 h-20 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center font-serif text-3xl text-white">
              {siteConfig.author?.slice(0, 1)}
            </div>
          )}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {siteConfig.author}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {siteConfig.description}
            </p>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
          <p>欢迎来到我的个人博客。这里记录我的技术笔记、生活碎片和一些小项目。</p>
          <p className="mt-4">
            本站基于 Cloudflare 纯托管架构（Workers + D1 + R2 + KV），
            前端使用 TanStack Start，UI 采用玻璃拟态设计。
          </p>
        </div>

        {siteConfig.social?.length ? (
          <div className="mt-8 pt-6 border-t border-border/30">
            <h3 className="text-sm font-medium text-foreground mb-3">找到我</h3>
            <div className="flex flex-wrap gap-2">
              {siteConfig.social
                .filter((l) => l.url)
                .map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button px-3 py-1.5 text-xs text-foreground/80 hover:text-foreground"
                  >
                    {l.label ?? l.platform}
                  </a>
                ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
