import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  deleteMessageFn,
  updateMessageFn,
} from "@/features/messages/api/messages.api";
import {
  MESSAGES_KEYS,
  MessagesListQueryOptions,
} from "@/features/messages/queries";
import type { Message } from "@/features/messages/messages.schema";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  pending: "待审",
  approved: "已通过",
  rejected: "已拒绝",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "border-amber-400/40 text-amber-600",
  approved: "border-emerald-400/40 text-emerald-600",
  rejected: "border-red-400/40 text-red-500",
};

/** 留言消息管理（后台） */
export function MessageManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<{ id: number; content: string } | null>(
    null,
  );

  const { data: messages = [], isLoading } = useQuery(
    MessagesListQueryOptions(),
  );

  const filtered = useMemo(
    () =>
      (messages as Message[]).filter((msg) =>
        msg.content.toLowerCase().includes(search.toLowerCase()),
      ),
    [messages, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: MESSAGES_KEYS.all });

  const updateStatusMutation = useMutation({
    mutationFn: async (data: { id: number; status: "approved" | "rejected" }) =>
      await updateMessageFn({
        data: { id: data.id, data: { status: data.status } },
      }),
    onSuccess: (result, vars) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "操作失败");
        return;
      }
      invalidate();
      toast.success(vars.status === "approved" ? "留言已通过" : "留言已拒绝");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteMessageFn({ data: { id } }),
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
            留言消息管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {messages.length} messages
          </p>
        </div>
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
            <div className="col-span-5">内容</div>
            <div className="col-span-2">IP</div>
            <div className="col-span-1">点赞</div>
            <div className="col-span-1">状态</div>
            <div className="col-span-1">时间</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {msg.id}
              </div>
              <div className="col-span-5 text-sm text-foreground truncate">
                {msg.content}
              </div>
              <div className="col-span-2 text-xs font-mono text-muted-foreground truncate">
                {msg.ip || "-"}
              </div>
              <div className="col-span-1 text-xs font-mono">{msg.likes}</div>
              <div className="col-span-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 border ${
                    STATUS_COLOR[msg.status] ?? ""
                  }`}
                >
                  {STATUS_LABEL[msg.status] ?? msg.status}
                </span>
              </div>
              <div className="col-span-1 text-xs text-muted-foreground">
                {formatDate(msg.createdAt)}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                {msg.status !== "approved" && (
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ id: msg.id, status: "approved" })
                    }
                    className="text-xs text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-0.5"
                  >
                    <Check size={11} />
                    通过
                  </button>
                )}
                {msg.status !== "rejected" && (
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ id: msg.id, status: "rejected" })
                    }
                    className="text-xs text-red-500 hover:text-red-400 transition-colors flex items-center gap-0.5"
                  >
                    <X size={11} />
                    拒绝
                  </button>
                )}
                <button
                  onClick={() => setDeleting({ id: msg.id, content: msg.content })}
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
