import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  createProjectFn,
  deleteProjectFn,
  updateProjectFn,
} from "@/features/projects/api/projects.api";
import {
  PROJECTS_KEYS,
  ProjectsListQueryOptions,
} from "@/features/projects/queries";
import type { Project } from "@/features/projects/projects.schema";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  developing: "开发中",
  finished: "已完成",
  archived: "已归档",
};

const STATUS_COLOR: Record<string, string> = {
  developing: "border-amber-400/40 text-amber-600",
  finished: "border-emerald-400/40 text-emerald-600",
  archived: "border-slate-400/40 text-slate-500",
};

/** 项目展示管理（后台） */
export function ProjectManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{
    id?: number;
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    techStack: string[];
    linkGithub: string;
    linkLive: string;
    linkDocs: string;
    status: "developing" | "finished" | "archived";
    statusLabel: string;
    isFeatured: boolean;
    sort: number;
  } | null>(null);
  const [deleting, setDeleting] = useState<{ id: number; name: string } | null>(
    null,
  );

  const { data: projects = [], isLoading } = useQuery(
    ProjectsListQueryOptions(),
  );

  const filtered = useMemo(
    () =>
      (projects as Project[]).filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [projects, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: PROJECTS_KEYS.all });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const data = {
        name: editing.name,
        slug: editing.slug,
        description: editing.description,
        coverImage: editing.coverImage,
        techStack: editing.techStack,
        linkGithub: editing.linkGithub,
        linkLive: editing.linkLive,
        linkDocs: editing.linkDocs,
        status: editing.status,
        statusLabel: editing.statusLabel,
        isFeatured: editing.isFeatured,
        sort: editing.sort,
      };
      if (editing.id) {
        return await updateProjectFn({ data: { id: editing.id, data } });
      }
      return await createProjectFn({ data });
    },
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "操作失败");
        return;
      }
      invalidate();
      setEditing(null);
      toast.success(editing?.id ? "项目已更新" : "项目已创建");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteProjectFn({ data: { id } }),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "删除失败");
        return;
      }
      invalidate();
      setDeleting(null);
      toast.success("项目已删除");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            项目展示管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {projects.length} projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索项目..."
              className="pl-9 w-48 h-9 rounded-none border-border/40"
            />
          </div>
          <Button
            onClick={() =>
              setEditing({
                name: "",
                slug: "",
                description: "",
                coverImage: "",
                techStack: [],
                linkGithub: "",
                linkLive: "",
                linkDocs: "",
                status: "developing",
                statusLabel: "开发中",
                isFeatured: false,
                sort: 0,
              })
            }
            className="h-9 px-4 rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={14} className="mr-1.5" />
            新建项目
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          暂无项目
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">名称</div>
            <div className="col-span-2">状态</div>
            <div className="col-span-2">技术栈</div>
            <div className="col-span-1">精选</div>
            <div className="col-span-1">排序</div>
            <div className="col-span-1">时间</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filtered.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {p.id}
              </div>
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    className="w-10 h-10 object-cover shrink-0 border border-border/30"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted/20 border border-border/30 shrink-0" />
                )}
                <span className="text-sm font-medium text-foreground truncate">
                  {p.name}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`text-[10px] px-1.5 py-0.5 border ${
                    STATUS_COLOR[p.status] ?? ""
                  }`}
                >
                  {(p.statusLabel || STATUS_LABEL[p.status]) ?? p.status}
                </span>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {(p.techStack ?? []).slice(0, 3).join(", ") || "-"}
              </div>
              <div className="col-span-1 text-xs">
                {p.isFeatured ? (
                  <span className="text-amber-500">★</span>
                ) : (
                  <span className="text-muted-foreground/30">☆</span>
                )}
              </div>
              <div className="col-span-1 text-xs">{p.sort ?? 0}</div>
              <div className="col-span-1 text-xs text-muted-foreground">
                {formatDate(p.createdAt)}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setEditing({
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      description: p.description,
                      coverImage: p.coverImage,
                      techStack: p.techStack ?? [],
                      linkGithub: p.linkGithub,
                      linkLive: p.linkLive,
                      linkDocs: p.linkDocs,
                      status: p.status,
                      statusLabel: p.statusLabel,
                      isFeatured: p.isFeatured,
                      sort: p.sort,
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => setDeleting({ id: p.id, name: p.name })}
                  className="text-xs text-destructive/70 hover:text-destructive transition-colors flex items-center gap-0.5"
                >
                  <Trash2 size={11} />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg border border-border/30 bg-background p-6 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-serif font-medium text-foreground mb-5">
              {editing.id ? "编辑项目" : "新建项目"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    项目名称 *
                  </label>
                  <Input
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    className="rounded-none border-border/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    Slug *
                  </label>
                  <Input
                    value={editing.slug}
                    onChange={(e) =>
                      setEditing({ ...editing, slug: e.target.value })
                    }
                    className="rounded-none border-border/40"
                    placeholder="my-project"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  封面 URL
                </label>
                <Input
                  value={editing.coverImage}
                  onChange={(e) =>
                    setEditing({ ...editing, coverImage: e.target.value })
                  }
                  className="rounded-none border-border/40"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  简介
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full min-h-16 rounded-none border border-border/40 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  技术栈（逗号分隔）
                </label>
                <Input
                  value={editing.techStack.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      techStack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="rounded-none border-border/40"
                  placeholder="React, Cloudflare, Hono"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    状态
                  </label>
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        status: e.target.value as Project["status"],
                        statusLabel: STATUS_LABEL[e.target.value] ?? e.target.value,
                      })
                    }
                    className="w-full h-9 rounded-none border border-border/40 bg-transparent px-3 text-sm text-foreground focus:outline-none focus:border-foreground"
                  >
                    <option value="developing">开发中</option>
                    <option value="finished">已完成</option>
                    <option value="archived">已归档</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    排序
                  </label>
                  <Input
                    type="number"
                    value={editing.sort}
                    onChange={(e) =>
                      setEditing({ ...editing, sort: Number(e.target.value) })
                    }
                    className="rounded-none border-border/40"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.isFeatured}
                      onChange={(e) =>
                        setEditing({ ...editing, isFeatured: e.target.checked })
                      }
                      className="accent-foreground"
                    />
                    精选展示
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    GitHub
                  </label>
                  <Input
                    value={editing.linkGithub}
                    onChange={(e) =>
                      setEditing({ ...editing, linkGithub: e.target.value })
                    }
                    className="rounded-none border-border/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    在线演示
                  </label>
                  <Input
                    value={editing.linkLive}
                    onChange={(e) =>
                      setEditing({ ...editing, linkLive: e.target.value })
                    }
                    className="rounded-none border-border/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    文档
                  </label>
                  <Input
                    value={editing.linkDocs}
                    onChange={(e) =>
                      setEditing({ ...editing, linkDocs: e.target.value })
                    }
                    className="rounded-none border-border/40"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
                className="rounded-none border-border/50"
              >
                取消
              </Button>
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={!editing.name.trim() || !editing.slug.trim() || saveMutation.isPending}
                className="rounded-none bg-foreground text-background hover:bg-foreground/90"
              >
                {saveMutation.isPending ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="删除项目"
        message={`确定要删除项目「${deleting?.name ?? ""}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
