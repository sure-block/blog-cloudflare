import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  createAlbumFn,
  deleteAlbumFn,
  updateAlbumFn,
} from "@/features/albums/api/albums.api";
import { ALBUMS_KEYS, AlbumsListQueryOptions } from "@/features/albums/queries";
import type { Album } from "@/features/albums/albums.schema";
import { formatDate } from "@/lib/utils";

/** 相册管理（后台） */
export function AlbumManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{
    id?: number;
    title: string;
    description: string;
    cover: string;
    sort: number;
  } | null>(null);
  const [deleting, setDeleting] = useState<{ id: number; title: string } | null>(
    null,
  );

  const { data: albums = [], isLoading } = useQuery(
    AlbumsListQueryOptions({ withPhotos: true }),
  );

  const filtered = useMemo(
    () =>
      (albums as Album[]).filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [albums, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ALBUMS_KEYS.all });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const data = {
        title: editing.title,
        description: editing.description,
        cover: editing.cover,
        sort: editing.sort,
      };
      if (editing.id) {
        return await updateAlbumFn({ data: { id: editing.id, data } });
      }
      return await createAlbumFn({ data });
    },
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "操作失败");
        return;
      }
      invalidate();
      setEditing(null);
      toast.success(editing?.id ? "相册已更新" : "相册已创建");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteAlbumFn({ data: { id } }),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "删除失败");
        return;
      }
      invalidate();
      setDeleting(null);
      toast.success("相册已删除");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            相册管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {albums.length} albums
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
              placeholder="搜索相册..."
              className="pl-9 w-48 h-9 rounded-none border-border/40"
            />
          </div>
          <Button
            onClick={() =>
              setEditing({ title: "", description: "", cover: "", sort: 0 })
            }
            className="h-9 px-4 rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={14} className="mr-1.5" />
            新建相册
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          暂无相册
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="group border border-border/30 bg-background hover:border-foreground/30 transition-all duration-300"
            >
              <div className="aspect-video bg-muted/10 border-b border-border/30 overflow-hidden">
                {a.cover ? (
                  <img
                    src={a.cover}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-serif italic text-sm">
                    no cover
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground truncate">
                    {a.title}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {a.photoCount} 张
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                  {a.description || "暂无描述"}
                </p>
                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-muted-foreground">
                    {formatDate(a.createdAt)}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setEditing({
                          id: a.id,
                          title: a.title,
                          description: a.description,
                          cover: a.cover,
                          sort: a.sort,
                        })
                      }
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => setDeleting({ id: a.id, title: a.title })}
                      className="text-destructive/70 hover:text-destructive transition-colors flex items-center gap-0.5"
                    >
                      <Trash2 size={11} />
                      删除
                    </button>
                  </div>
                </div>
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
              {editing.id ? "编辑相册" : "新建相册"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  相册名称 *
                </label>
                <Input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  className="rounded-none border-border/40"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  描述
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full min-h-20 rounded-none border border-border/40 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  封面 URL
                </label>
                <Input
                  value={editing.cover}
                  onChange={(e) =>
                    setEditing({ ...editing, cover: e.target.value })
                  }
                  className="rounded-none border-border/40"
                  placeholder="https://..."
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
                disabled={!editing.title.trim() || saveMutation.isPending}
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
        title="删除相册"
        message={`确定要删除相册「${deleting?.title ?? ""}」吗？其内照片也会一并删除。`}
        confirmLabel="删除"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
