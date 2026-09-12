import { useQuery } from "@tanstack/react-query";
import { ScrollText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { LoginLogsListQueryOptions } from "@/features/login-logs/queries";
import type { LoginLog } from "@/features/login-logs/login-logs.schema";
import { formatDate } from "@/lib/utils";

/** 登录日志（后台） */
export function LoginLogManager() {
  const [search, setSearch] = useState("");

  const { data: logResp, isLoading } = useQuery(
    LoginLogsListQueryOptions({ limit: 100 }),
  );
  const logs = logResp ?? [];

  const filtered = useMemo(
    () =>
      (logs as LoginLog[]).filter(
        (l) =>
          l.username.toLowerCase().includes(search.toLowerCase()) ||
          l.ip.toLowerCase().includes(search.toLowerCase()) ||
          l.summary.toLowerCase().includes(search.toLowerCase()),
      ),
    [logs, search],
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            登录日志
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {logs.length} records
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
            placeholder="搜索用户 / IP / 摘要..."
            className="pl-9 w-56 h-9 rounded-none border-border/40"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-serif italic">
          加载中...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-muted-foreground font-serif italic">
          <ScrollText size={32} className="opacity-20" />
          暂无登录日志
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">用户</div>
            <div className="col-span-2">IP</div>
            <div className="col-span-2">地址</div>
            <div className="col-span-2">系统 / 浏览器</div>
            <div className="col-span-2">摘要</div>
            <div className="col-span-1">时间</div>
          </div>

          {filtered.map((l) => (
            <div
              key={l.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground">
                {l.id}
              </div>
              <div className="col-span-2 text-xs font-medium text-foreground truncate">
                {l.username || "-"}
              </div>
              <div className="col-span-2 text-xs font-mono text-muted-foreground truncate">
                {l.ip || "-"}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {l.address || "-"}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {[l.system, l.browser].filter(Boolean).join(" / ") || "-"}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground truncate">
                {l.summary || "-"}
              </div>
              <div className="col-span-1 text-xs text-muted-foreground">
                {formatDate(l.operatingTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
