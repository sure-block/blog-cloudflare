import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Bookmark, ExternalLink } from "lucide-react";
import { getBookmarksFn } from "@/features/bookmarks/api/bookmarks.api";

const bookmarksQuery = queryOptions({
  queryKey: ["public", "bookmarks"],
  queryFn: async () => {
    return await getBookmarksFn({ data: { withSites: true } });
  },
  staleTime: 5 * 60_000,
});

interface BookmarkSite {
  id: number;
  name: string;
  url: string;
  icon?: string | null;
  description?: string | null;
}
interface BookmarkCategory {
  id: number;
  name: string;
  icon?: string | null;
  sites?: BookmarkSite[];
}

/** 书签页 */
export function BookmarkPage() {
  const { data: categories = [], isLoading } = useQuery(bookmarksQuery);

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <Bookmark className="text-indigo-400" size={28} />
          书签
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          共 {categories.length} 个分类
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="glass-card py-20 text-center text-muted-foreground">
          暂无书签
        </div>
      ) : (
        <div className="space-y-6">
          {(categories as BookmarkCategory[]).map((cat) => (
            <section key={cat.id} className="glass-card p-5">
              <h2 className="font-serif text-lg font-medium text-foreground mb-4">
                {cat.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(cat.sites ?? []).map((site) => (
                  <a
                    key={site.id}
                    href={site.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button !rounded-xl p-3 hover-lift flex flex-col gap-2"
                  >
                    {site.icon ? (
                      <img
                        src={site.icon}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <ExternalLink size={14} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {site.name}
                      </p>
                      {site.description ? (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {site.description}
                        </p>
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
