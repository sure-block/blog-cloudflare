import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  createMusicFn,
  deleteMusicFn,
  updateMusicFn,
} from "@/features/music/api/music.api";
import { MUSIC_KEYS, MusicListQueryOptions } from "@/features/music/queries";
import type { Music } from "@/features/music/music.schema";
import { formatDate } from "@/lib/utils";

/** 音乐管理（后台） */
export function MusicManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{
    id?: number;
    title: string;
    artist: string;
    cover: string;
    src: string;
    lrc: string;
    lrcSrc: string;
    type: "local" | "netease";
    sort: number;
  } | null>(null);
  const [deleting, setDeleting] = useState<{ id: number; title: string } | null>(
    null,
  );

  const { data: music = [], isLoading } = useQuery(MusicListQueryOptions());

  const filtered = useMemo(
    () =>
      (music as Music[]).filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.artist.toLowerCase().includes(search.toLowerCase()),
      ),
    [music, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: MUSIC_KEYS.all });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const data = {
        title: editing.title,
        artist: editing.artist,
        cover: editing.cover,
        src: editing.src,
        lrc: editing.lrc,
        lrcSrc: editing.lrcSrc,
        type: editing.type,
        sort: editing.sort,
      };
      if (editing.id) {
        return await updateMusicFn({ data: { id: editing.id, data } });
      }
      return await createMusicFn({ data });
    },
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "操作失败");
        return;
      }
      invalidate();
      setEditing(null);
      toast.success(editing?.id ? "音乐已更新" : "音乐已添加");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteMusicFn({ data: { id } }),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "删除失败");
        return;
      }
      invalidate();
      setDeleting(null);
      toast.success("音乐已删除");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            音乐管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {music.length} tracks
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
              placeholder="搜索歌名/歌手..."
              className="pl-9 w-48 h-9 rounded-none border-border/40"
            />
          </div>
          <Button
            onClick={() =>
              setEditing({
                title: "",
                artist: "",
                cover: "",
                src: "",
                lrc: "",
                lrcSrc: "",
                type: "local",
                sort: 0,
              })
            }
            className="h-9 px-4 rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus size={14} className="mr-1.5" />
            添加音乐
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          暂无音乐
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">歌名</div>
            <div className="col-span-2">歌手</div>
            <div className="col-span-2">来源</div>
            <div className="col-span-1">排序</div>
            <div className="col-span-2">上传时间</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filtered.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {m.id}
              </div>
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                {m.cover ? (
                  <img
                    src={m.cover}
                    className="w-10 h-10 object-cover rounded-none border border-border/30 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted/20 border border-border/30 shrink-0" />
                )}
                <span className="text-sm font-medium text-foreground truncate">
                  {m.title}
                </span>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {m.artist || "-"}
              </div>
              <div className="col-span-2 text-xs font-mono">
                <span
                  className={`px-1.5 py-0.5 text-[10px] border ${
                    m.type === "netease"
                      ? "border-red-400/40 text-red-500"
                      : "border-emerald-400/40 text-emerald-600"
                  }`}
                >
                  {m.type === "netease" ? "网易云" : "本地"}
                </span>
              </div>
              <div className="col-span-1 text-xs">{m.sort ?? 0}</div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {formatDate(m.createdAt)}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setEditing({
                      id: m.id,
                      title: m.title,
                      artist: m.artist,
                      cover: m.cover,
                      src: m.src,
                      lrc: m.lrc,
                      lrcSrc: m.lrcSrc,
                      type: m.type,
                      sort: m.sort,
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => setDeleting({ id: m.id, title: m.title })}
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
              {editing.id ? "编辑音乐" : "添加音乐"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                    歌名 *
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
                    歌手
                  </label>
                  <Input
                    value={editing.artist}
                    onChange={(e) =>
                      setEditing({ ...editing, artist: e.target.value })
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
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  音频地址（网易云/本地 URL）*
                </label>
                <Input
                  value={editing.src}
                  onChange={(e) =>
                    setEditing({ ...editing, src: e.target.value })
                  }
                  className="rounded-none border-border/40"
                  placeholder="https://.../song.mp3 或网易云外链"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  类型
                </label>
                <select
                  value={editing.type}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      type: e.target.value as "local" | "netease",
                    })
                  }
                  className="w-full h-9 rounded-none border border-border/40 bg-transparent px-3 text-sm text-foreground focus:outline-none focus:border-foreground"
                >
                  <option value="local">本地</option>
                  <option value="netease">网易云</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  歌词（LRC）
                </label>
                <textarea
                  value={editing.lrc}
                  onChange={(e) =>
                    setEditing({ ...editing, lrc: e.target.value })
                  }
                  className="w-full min-h-16 rounded-none border border-border/40 bg-transparent px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground font-mono"
                  placeholder="[00:00.00]歌词..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  歌词外链
                </label>
                <Input
                  value={editing.lrcSrc}
                  onChange={(e) =>
                    setEditing({ ...editing, lrcSrc: e.target.value })
                  }
                  className="rounded-none border-border/40"
                  placeholder="https://.../lyric.lrc"
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
                disabled={!editing.title.trim() || !editing.src.trim() || saveMutation.isPending}
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
        title="删除音乐"
        message={`确定要删除「${deleting?.title ?? ""}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
