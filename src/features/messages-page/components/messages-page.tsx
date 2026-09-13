import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createMessageFn,
  getMessagesFn,
} from "@/features/messages/api/messages.api";

const messagesQuery = queryOptions({
  queryKey: ["public", "messages"],
  queryFn: async () => {
    const result = await getMessagesFn({
      data: { limit: 100, status: "approved" },
    });
    return result.items ?? [];
  },
  staleTime: 30_000,
});

/** 留言板前台页 */
export function MessagesPage() {
  const qc = useQueryClient();
  const { data: messages = [], isLoading } = useQuery(messagesQuery);
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      await createMessageFn({
        data: {
          content,
          emailUserName: nickname || undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("留言已提交，等待审核");
      setContent("");
      setNickname("");
      qc.invalidateQueries({ queryKey: ["public", "messages"] });
    },
    onError: () => toast.error("提交失败"),
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <MessageSquare className="text-pink-400" size={28} />
          留言板
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          共 {messages.length} 条留言
        </p>
      </header>

      {/* 发表留言 */}
      <section className="glass-card p-5 mb-6">
        <h2 className="font-serif text-base font-medium text-foreground mb-4">
          写下你的留言
        </h2>
        <div className="space-y-3">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="你的昵称（可选）"
            className="glass-input"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="说点什么吧..."
            rows={4}
            className="w-full rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ring-indigo-400/30"
          />
          <Button
            type="button"
            onClick={() => submit.mutate()}
            disabled={!content.trim() || submit.isPending}
            className="glass-button !rounded-full flex items-center gap-2"
          >
            <Send size={14} />
            {submit.isPending ? "提交中..." : "提交留言"}
          </Button>
          <p className="text-xs text-muted-foreground">
            留言需审核后显示
          </p>
        </div>
      </section>

      {/* 留言列表 */}
      {isLoading ? (
        <p className="py-10 text-center text-muted-foreground">加载中...</p>
      ) : messages.length === 0 ? (
        <div className="glass-card py-16 text-center text-muted-foreground">
          还没有留言，来抢沙发
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                  {(m.emailUserName || "匿").slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {m.emailUserName || "匿名"}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                {m.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
