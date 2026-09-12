import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  createChatterFn,
  deleteChatterFn,
  updateChatterFn,
} from "@/features/chatters/api/chatters.api";
import {
  CHATTERS_KEYS,
  ChattersListQueryOptions,
} from "@/features/chatters/queries";
import type { Chatter } from "@/features/chatters/chatters.schema";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  draft: "草稿",
  published: "已发布",
};

/** 留言板（唠嗑）管理 — 后台 */
export function ChatterManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{
    id?: number;
    content: string;
    mood: string;
    images: string[];
    status: "draft" | "published";
  } | null>(null);
  const [deleting, setDeleting] = useState<{ id: number; content: string } | null>(
    null,
  );

  const { data: chatters = [], isLoading } = useQuery(ChattersListQueryOptions());

  const filtered = useMemo(
    () =>
      (chatters as Chatter[]).filter(
        (c) =>
          c.content.toLowerCase().includes(search.toLowerCase()) ||
          c.mood.toLowerCase().includes(search.toLowerCase()),
      ),
    [chatters, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: CHATTERS_KEYS.all });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const data = {
        content: editing.content,
        mood: editing.mood,
        images: editing.images,
        status: editing.status,
      };
      if (editing.id) {
        return await updateChatterFn({ data: { id: editing.id, data } });
      }
      return await createChatterFn({ data });
    },
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "操作失败");
        return;
      }
      invalidate();
      setEditing(null);
      toast.success(editing?.id ? "留言已更新" : "留言已发布");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteChatterFn({ data: { id } }),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "删除失败");
        return;
      }
      invalidate();
      setDeleting(null);
      toast.success("留言已删除");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            留言板管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {chatters.length} messages
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
              placeholder="搜索留言..."
              className="pl-9 w-48 h-9 rounded-none border-border/40"
            />
          </div>
          <Button
            onClick={() =>
              setEditing({ content: "", mood: "", images: [], status: "published" })
            }
            className="h-9 px-4 rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={14} className="mr-1.5" />
            发布留言
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          暂无留言
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-4">内容</div>
            <div className="col-span-2">心情</div>
            <div className="col-span-1">点赞</div>
            <div className="col-span-1">评论</div>
            <div className="col-span-1">状态</div>
            <div className="col-span-1">时间</div>
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
              <div className="col-span-4 text-sm text-foreground truncate">
                {c.content}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {c.mood ? `「${c.mood}」` : "-"}
              </div>
              <div className="col-span-1 text-xs font-mono">{c.likes}</div>
              <div className="col-span-1 text-xs font-mono">{c.commentsCount}</div>
              <div className="col-span-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 border ${
                    c.status === "published"
                      ? "border-emerald-400/40 text-emerald-600"
                      : "border-amber-400/40 text-amber-600"
                  }`}
                >
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
              </div>
              <div className="col-span-1 text-xs text-muted-foreground">
                {formatDate(c.createdAt)}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setEditing({
                      id: c.id,
                      content: c.content,
                      mood: c.mood,
                      images: c.images ?? [],
                      status: c.status,
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => setDeleting({ id: c.id, content: c.content })}
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
              {editing.id ? "编辑留言" : "发布留言"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  内容 *
                </label>
                <textarea
                  value={editing.content}
                  onChange={(e) =>
                    setEditing({ ...editing, content: e.target.value })
                  }
                  className="w-full min-h-24 rounded-none border border-border/40 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  心情
                </label>
                <Input
                  value={editing.mood}
                  onChange={(e) =>
                    setEditing({ ...editing, mood: e.target.value })
                  }
                  className="rounded-none border-border/40"
                  placeholder="开心 / 丧 / 平静..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  图片 URL（逗号分隔，最多 9 张）
                </label>
                <Input
                  value={editing.images.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      images: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="rounded-none border-border/40"
                  placeholder="https://img1, https://img2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  状态
                </label>
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  className="w-full h-9 rounded-none border border-border/40 bg-transparent px-3 text-sm text-foreground focus:outline-none focus:border-foreground"
                >
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
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
                disabled={!editing.content.trim() || saveMutation.isPending}
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
        title="删除留言"
        message={`确定要删除这条留言吗？\n「${deleting?.content.slice(0, 50) ?? ""}」`}
        confirmLabel="删除"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
