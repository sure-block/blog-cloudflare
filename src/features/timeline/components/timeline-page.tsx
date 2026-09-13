import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Calendar, Clock } from "lucide-react";
import { useMemo } from "react";
import { getPostsCursorFn } from "@/features/posts/api/posts.public.api";

const postsQuery = queryOptions({
  queryKey: ["public", "timeline"],
  queryFn: async () => {
    const result = await getPostsCursorFn({ data: { limit: 100 } });
    return result.items ?? [];
  },
  staleTime: 5 * 60_000,
});

/** 时间线页 */
export function TimelinePage() {
  const { data: posts = [], isLoading } = useQuery(postsQuery);

  const groups = useMemo(() => {
    const map = new Map<string, typeof posts>();
    for (const p of posts) {
      if (!p.publishedAt) continue;
      const d = new Date(p.publishedAt);
      const key = `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
      const list = map.get(key) ?? [];
      list.push(p);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [posts]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground">加载中...</div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          时间线
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          共 {posts.length} 篇文章
        </p>
      </header>

      <div className="relative pl-6 md:pl-8 border-l border-border/40 space-y-10">
        {groups.map(([month, list]) => (
          <section key={month}>
            <h2 className="font-serif text-lg font-medium text-gradient mb-4">
              {month}
            </h2>
            <div className="space-y-3">
              {list.map((post) => (
                <Link
                  key={post.id}
                  to="/post/$slug"
                  params={{ slug: post.slug }}
                  className="group block glass-button !rounded-xl px-4 py-3"
                >
                  <h3 className="text-sm font-medium text-foreground group-hover:text-gradient line-clamp-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTimeInMinutes} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
