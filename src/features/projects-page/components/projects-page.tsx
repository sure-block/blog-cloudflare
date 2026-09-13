import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { ExternalLink, FolderGit2 } from "lucide-react";
import { getProjectsFn } from "@/features/projects/api/projects.api";

const projectsQuery = queryOptions({
  queryKey: ["public", "projects"],
  queryFn: async () => {
    return await getProjectsFn({ data: { limit: 100 } });
  },
  staleTime: 5 * 60_000,
});

const STATUS_COLOR: Record<string, string> = {
  developing: "border-blue-400/40 text-blue-500",
  finished: "border-emerald-400/40 text-emerald-600",
  archived: "border-slate-400/40 text-slate-500",
};

/** 项目展示页 */
export function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery(projectsQuery);

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <FolderGit2 className="text-indigo-400" size={28} />
          项目
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          共 {projects.length} 个项目
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="glass-card py-20 text-center text-muted-foreground">
          暂无项目
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <article
              key={p.id}
              className="glass-card p-5 hover-lift flex flex-col gap-3"
            >
              {p.coverImage ? (
                <img
                  src={p.coverImage}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-lg border border-white/20"
                />
              ) : null}
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-medium text-foreground">
                  {p.name}
                </h2>
                {p.status ? (
                  <span
                    className={`text-[10px] px-2 py-0.5 border ${STATUS_COLOR[p.status] ?? "border-slate-400/40"}`}
                  >
                    {p.statusLabel ?? p.status}
                  </span>
                ) : null}
              </div>
              {p.description ? (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {p.description}
                </p>
              ) : null}
              {p.techStack?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="flex gap-3 mt-auto pt-2">
                {p.linkGithub ? (
                  <a
                    href={p.linkGithub}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button p-2"
                    aria-label="GitHub"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : null}
                {p.linkLive ? (
                  <a
                    href={p.linkLive}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button p-2"
                    aria-label="在线预览"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
