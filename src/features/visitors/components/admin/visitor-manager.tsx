import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eraser, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import {
  clearVisitorsFn,
  deleteVisitorFn,
} from "@/features/visitors/api/visitors.api";
import {
  VISITORS_KEYS,
  VisitorsListQueryOptions,
} from "@/features/visitors/queries";
import type { Visitor } from "@/features/visitors/visitors.schema";
import { formatDate } from "@/lib/utils";

/** 访客统计（后台） */
export function VisitorManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<{ id: number; ip: string } | null>(
    null,
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const { data: visitorResp, isLoading } = useQuery(
    VisitorsListQueryOptions({ limit: 100 }),
  );
  const visitors = visitorResp ?? [];

  const filtered = useMemo(
    () =>
      (visitors as Visitor[]).filter(
        (v) =>
          v.ip.toLowerCase().includes(search.toLowerCase()) ||
          v.city.toLowerCase().includes(search.toLowerCase()) ||
          v.country.toLowerCase().includes(search.toLowerCase()),
      ),
    [visitors, search],
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: VISITORS_KEYS.all });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteVisitorFn({ data: { id } }),
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error.reason ?? "删除失败");
        return;
      }
      invalidate();
      setDeleting(null);
      toast.success("记录已删除");
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => await clearVisitorsFn({ data: {} }),
    onSuccess: () => {
      invalidate();
      setShowClearConfirm(false);
      toast.success("访客记录已清空");
    },
  });

  const locationOf = (v: Visitor) =>
    [v.country, v.region, v.city, v.district].filter(Boolean).join(" · ") ||
    "未知";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            访客统计
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {visitors.length} records
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
              placeholder="搜索 IP / 地区..."
              className="pl-9 w-48 h-9 rounded-none border-border/40"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowClearConfirm(true)}
            className="h-9 px-4 rounded-none border-red-400/40 text-red-500 hover:bg-red-500/10"
          >
            <Eraser size={14} className="mr-1.5" />
            清空
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          暂无访客记录
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">IP</div>
            <div className="col-span-2">地区</div>
            <div className="col-span-1">ASN</div>
            <div className="col-span-2">网络</div>
            <div className="col-span-2">设备</div>
            <div className="col-span-1">时间</div>
            <div className="col-span-1 text-right">操作</div>
          </div>

          {filtered.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {v.id}
              </div>
              <div className="col-span-2 text-xs font-mono text-foreground truncate">
                {v.ip}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {locationOf(v)}
              </div>
              <div className="col-span-1 text-xs font-mono text-muted-foreground truncate">
                {v.asn || "-"}
              </div>
              <div className="col-span-2 flex gap-1 flex-wrap">
                {v.isHosting ? (
                  <span className="text-[10px] px-1.5 py-0.5 border border-amber-400/40 text-amber-600">
                    机房
                  </span>
                ) : v.isMobile ? (
                  <span className="text-[10px] px-1.5 py-0.5 border border-emerald-400/40 text-emerald-600">
                    移动
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 border border-slate-400/40 text-slate-500">
                    宽带
                  </span>
                )}
                {v.isProxy && (
                  <span className="text-[10px] px-1.5 py-0.5 border border-red-400/40 text-red-500">
                    代理
                  </span>
                )}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {[v.os, v.browser, v.deviceType].filter(Boolean).join(" / ") || "-"}
              </div>
              <div className="col-span-1 text-xs text-muted-foreground">
                {formatDate(v.createdAt)}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button
                  onClick={() => setDeleting({ id: v.id, ip: v.ip })}
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
        title="删除记录"
        message={`确定要删除 IP ${deleting?.ip ?? ""} 的访客记录吗？`}
        confirmLabel="删除"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => clearMutation.mutate()}
        title="清空访客记录"
        message="确定要清空所有访客记录吗？此操作不可撤销。"
        confirmLabel="清空"
        isLoading={clearMutation.isPending}
      />
    </div>
  );
}
