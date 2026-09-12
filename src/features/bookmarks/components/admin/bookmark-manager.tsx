import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  createBookmarkCategoryFn,
  deleteBookmarkCategoryFn,
  updateBookmarkCategoryFn,
} from "@/features/bookmarks/api/bookmarks.api";
import {
  BOOKMARKS_KEYS,
  BookmarksListQueryOptions,
} from "@/features/bookmarks/queries";
import type { BookmarkCategory } from "@/features/bookmarks/bookmarks.schema";

/** 书签分类管理（后台） */
export function BookmarkManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{
    id?: number;
    name: string;
    icon: string;
    description: string;
    sort: number;
  } | null>(null);
  const [deleting, setDeleting] = useState<{ id: number; name: string } | null>(
    null,
  );

  const { data: categories = [], isLoading } = useQuery(
    BookmarksListQueryOptions(),
  );

  const filtered = useMemo(
    () =>
      (categories as BookmarkCategory[]).filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [categories, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: BOOKMARKS_KEYS.all });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const data = {
        name: editing.name,
        icon: editing.icon,
        description: editing.description,
        sort: editing.sort,
      };
      if (editing.id) {
        return await updateBookmarkCategoryFn({ data: { id: editing.id, data } });
      }
      return await createBookmarkCategoryFn({ data });
    },
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "操作失败");
        return;
      }
      invalidate();
      setEditing(null);
      toast.success(editing?.id ? "分类已更新" : "分类已创建");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      await deleteBookmarkCategoryFn({ data: { id } }),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "删除失败");
        return;
      }
      invalidate();
      setDeleting(null);
      toast.success("分类已删除");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            书签分类管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {categories.length} categories
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
              placeholder="搜索分类..."
              className="pl-9 w-48 h-9 rounded-none border-border/40"
            />
          </div>
          <Button
            onClick={() => setEditing({ name: "", icon: "", description: "", sort: 0 })}
            className="h-9 px-4 rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={14} className="mr-1.5" />
            新增分类
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          暂无分类
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">图标</div>
            <div className="col-span-3">分类名称</div>
            <div className="col-span-3">描述</div>
            <div className="col-span-1">排序</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filtered.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {c.id}
              </div>
              <div className="col-span-3 flex items-center gap-2">
                {c.icon ? (
                  <img
                    src={c.icon}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 bg-muted/20 border border-border/30 shrink-0" />
                )}
                <span className="text-xs font-mono text-muted-foreground truncate">
                  {c.icon || "-"}
                </span>
              </div>
              <div className="col-span-3 text-sm font-medium text-foreground truncate">
                {c.name}
              </div>
              <div className="col-span-3 text-xs text-muted-foreground truncate">
                {c.description || "-"}
              </div>
              <div className="col-span-1 text-xs">{c.sort ?? 0}</div>
              <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setEditing({
                      id: c.id,
                      name: c.name,
                      icon: c.icon,
                      description: c.description,
                      sort: c.sort,
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => setDeleting({ id: c.id, name: c.name })}
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
          <div className="w-full max-w-md border border-border/30 bg-background p-6 animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-serif font-medium text-foreground mb-5">
              {editing.id ? "编辑分类" : "新增分类"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  分类名称 *
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
                  图标 URL
                </label>
                <Input
                  value={editing.icon}
                  onChange={(e) =>
                    setEditing({ ...editing, icon: e.target.value })
                  }
                  className="rounded-none border-border/40"
                  placeholder="https://.../icon.png"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  描述
                </label>
                <Input
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="rounded-none border-border/40"
                />
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
                  className="rounded-none border-border/40 w-28"
                />
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
                disabled={!editing.name.trim() || saveMutation.isPending}
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
        title="删除分类"
        message={`确定要删除书签分类「${deleting?.name ?? ""}」吗？其下站点也会删除。`}
        confirmLabel="删除"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
