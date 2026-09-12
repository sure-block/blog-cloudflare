import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { NavOption, UserInfo } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";

interface MobileMenuProps {
  navOptions: Array<NavOption>;
  isOpen: boolean;
  onClose: () => void;
  user?: UserInfo;
  logout: () => Promise<void>;
}

/** Sure 主题移动端菜单 — 毛玻璃全屏抽屉 */
export function MobileMenu({
  navOptions,
  isOpen,
  onClose,
  user,
  logout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* 抽屉 */}
      <div className="absolute right-0 top-0 bottom-0 w-72 glass-card !rounded-none p-6 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <span className="font-serif text-lg font-bold text-gradient">
            {m.common_open_menu()}
          </span>
          <button
            onClick={onClose}
            className="glass-button p-2"
            aria-label={m.common_close()}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navOptions.map((option) => (
            <Link
              key={option.id}
              to={option.to}
              onClick={onClose}
              className="glass-button px-4 py-3 text-foreground/85 hover:text-foreground"
            >
              {option.label}
            </Link>
          ))}
          <Link
            to="/garden/stars"
            onClick={onClose}
            className="glass-button px-4 py-3 text-foreground/85 hover:text-foreground"
          >
            星港 · 3D 太阳系
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-border/30">
          {user ? (
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <button
                  onClick={logout}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  {m.profile_logout()}
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="glass-button px-4 py-2.5 text-sm block text-center"
            >
              {m.nav_login()}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
