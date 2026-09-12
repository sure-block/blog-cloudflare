import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { Search, Shield, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth.client";
import { formatDate } from "@/lib/utils";

/** 用户管理查询 */
export const adminUsersQuery = queryOptions({
  queryKey: ["admin", "users"],
  queryFn: async () => {
    const { data, error } = await authClient.admin.listUsers({
      query: { limit: 100 },
    });
    if (error) throw new Error(error.message ?? "加载用户失败");
    return data?.users ?? [];
  },
  staleTime: 30_000,
});

/** 用户管理（后台） */
export function UserManager() {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery(adminUsersQuery);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-border/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
            用户管理
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            {users.length} users
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
            placeholder="搜索用户 / 邮箱..."
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
          <UserRound size={32} className="opacity-20" />
          暂无用户
        </div>
      ) : (
        <div className="border border-border/30 divide-y divide-border/30">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">用户</div>
            <div className="col-span-3">邮箱</div>
            <div className="col-span-2">角色</div>
            <div className="col-span-2">状态</div>
            <div className="col-span-1">注册时间</div>
          </div>

          {filtered.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 items-center hover:bg-muted/5 transition-colors"
            >
              <div className="col-span-1 text-xs font-mono text-muted-foreground truncate">
                {u.id.slice(0, 8)}
              </div>
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                {u.image ? (
                  <img
                    src={u.image}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-border/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted/20 border border-border/30 shrink-0 flex items-center justify-center">
                    <UserRound size={14} className="text-muted-foreground/40" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground truncate">
                  {u.name || "-"}
                </span>
              </div>
              <div className="col-span-3 text-xs text-muted-foreground truncate">
                {u.email || "-"}
              </div>
              <div className="col-span-2">
                <span
                  className={`text-[10px] px-1.5 py-0.5 border flex items-center gap-1 w-fit ${
                    u.role === "admin"
                      ? "border-indigo-400/40 text-indigo-500"
                      : "border-slate-400/40 text-slate-500"
                  }`}
                >
                  {u.role === "admin" && <Shield size={10} />}
                  {u.role === "admin" ? "管理员" : "读者"}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`text-[10px] px-1.5 py-0.5 border ${
                    u.banned
                      ? "border-red-400/40 text-red-500"
                      : "border-emerald-400/40 text-emerald-600"
                  }`}
                >
                  {u.banned ? "已封禁" : "正常"}
                </span>
              </div>
              <div className="col-span-1 text-xs text-muted-foreground">
                {u.createdAt ? formatDate(u.createdAt) : "-"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
