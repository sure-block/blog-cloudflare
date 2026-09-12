import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  createBookFn,
  deleteBookFn,
  updateBookFn,
} from "@/features/books/api/books.api";
import { BOOKS_KEYS, BooksListQueryOptions } from "@/features/books/queries";
import type { Book } from "@/features/books/books.schema";
import { formatDate, formatBytes } from "@/lib/utils";

/** 书籍管理（后台） */
export function BookManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{
    id?: number;
    title: string;
    author: string;
    cover: string;
    description: string;
    fileUrl: string;
    format: string;
    sort: number;
  } | null>(null);
  const [deleting, setDeleting] = useState<{ id: number; title: string } | null>(
    null,
  );

  const { data: bookResp, isLoading } = useQuery(BooksListQueryOptions());
  const books = bookResp?.items ?? [];

  const filtered = useMemo(
    () =>
      (books as Book[]).filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase()),
      ),
    [books, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: BOOKS_KEYS.all });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const data = {
        title: editing.title,
        author: editing.author,
        cover: editing.cover,
        description: editing.description,
        fileUrl: editing.fileUrl,
        format: editing.format,
        sort: editing.sort,
      };
      if (editing.id) {
        return await updateBookFn({ data: { id: editing.id, data } });
      }
      return await createBookFn({ data });
    },
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "操作失败");
        return;
      }
      invalidate();
      setEditing(null);
      toast.success(editing?.id ? "书籍已更新" : "书籍已添加");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteBookFn({ data: { id } }),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "删除失败");
        return;
      }
      invalidate();
      setDeleting(null);
      toast.success("书籍已删除");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            书籍管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {books.length} books
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
              placeholder="搜索书名/作者..."
              className="pl-9 w-48 h-9 rounded-none border-border/40"
            />
          </div>
          <Button
            onClick={() =>
              setEditing({
                title: "",
                author: "",
                cover: "",
                description: "",
                fileUrl: "",
                format: "epub",
                sort: 0,
              })
            }
            className="h-9 px-4 rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={14} className="mr-1.5" />
            添加书籍
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          暂无书籍
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">书名</div>
            <div className="col-span-2">作者</div>
            <div className="col-span-1">格式</div>
            <div className="col-span-1">大小</div>
            <div className="col-span-1">阅读</div>
            <div className="col-span-1">章节</div>
            <div className="col-span-1">时间</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filtered.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {b.id}
              </div>
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                {b.cover ? (
                  <img
                    src={b.cover}
                    className="w-9 h-12 object-cover shrink-0 border border-border/30"
                  />
                ) : (
                  <div className="w-9 h-12 bg-muted/20 border border-border/30 shrink-0 flex items-center justify-center">
                    <BookOpen size={14} className="text-muted-foreground/40" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground truncate">
                  {b.title}
                </span>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {b.author || "-"}
              </div>
              <div className="col-span-1 text-xs font-mono uppercase">
                {b.format}
              </div>
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {b.fileSize ? formatBytes(b.fileSize) : "-"}
              </div>
              <div className="col-span-1 text-xs font-mono">{b.views}</div>
              <div className="col-span-1 text-xs font-mono">{b.chapterCount}</div>
              <div className="col-span-1 text-xs text-muted-foreground">
                {formatDate(b.createdAt)}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setEditing({
                      id: b.id,
                      title: b.title,
                      author: b.author,
                      cover: b.cover,
                      description: b.description,
                      fileUrl: b.fileUrl,
                      format: b.format,
                      sort: b.sort,
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => setDeleting({ id: b.id, title: b.title })}
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
              {editing.id ? "编辑书籍" : "添加书籍"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    书名 *
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
                    作者
                  </label>
                  <Input
                    value={editing.author}
                    onChange={(e) =>
                      setEditing({ ...editing, author: e.target.value })
                    }
                    className="rounded-none border-border/40"
                  />
                </div>
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
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  书籍文件地址（R2 / 外链）*
                </label>
                <Input
                  value={editing.fileUrl}
                  onChange={(e) =>
                    setEditing({ ...editing, fileUrl: e.target.value })
                  }
                  className="rounded-none border-border/40"
                  placeholder="https://.../book.epub"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    格式
                  </label>
                  <select
                    value={editing.format}
                    onChange={(e) =>
                      setEditing({ ...editing, format: e.target.value })
                    }
                    className="w-full h-9 rounded-none border border-border/40 bg-transparent px-3 text-sm text-foreground focus:outline-none focus:border-foreground"
                  >
                    <option value="epub">EPUB</option>
                    <option value="pdf">PDF</option>
                    <option value="txt">TXT</option>
                    <option value="mobi">MOBI</option>
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
                disabled={!editing.title.trim() || !editing.fileUrl.trim() || saveMutation.isPending}
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
        title="删除书籍"
        message={`确定要删除「${deleting?.title ?? ""}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
