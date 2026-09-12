import { Link, useRouteContext } from "@tanstack/react-router";
import { Menu, Search, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavOption, UserInfo } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";

interface NavbarProps {
  navOptions: Array<NavOption>;
  onMenuClick: () => void;
  isLoading?: boolean;
  user?: UserInfo;
}

/** Sure 主题导航栏 — 玻璃拟态毛玻璃悬浮 */
export function Navbar({ onMenuClick, user, navOptions, isLoading }: NavbarProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const brandName =
    siteConfig.theme.sure?.navBarName ??
    siteConfig.theme.default.navBarName ??
    siteConfig.title;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "glass-card !rounded-none !border-x-0 !border-t-0 py-3 shadow-lg"
          : "bg-transparent border-transparent py-6"
      }`}
      style={isScrolled ? { borderRadius: 0, borderTop: "none" } : undefined}
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-10 flex items-center justify-between">
        {/* Left: Brand */}
        <Link to="/" className="group select-none">
          <span className="font-serif text-xl font-bold tracking-tight text-gradient transition-all group-hover:scale-105 inline-block">
            {brandName}
          </span>
        </Link>

        {/* Center: Main Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navOptions.map((option) => (
            <Link
              key={option.id}
              to={option.to}
              className="glass-button px-4 py-2 text-sm text-foreground/80 hover:text-foreground !rounded-full"
              activeOptions={{ exact: option.to === "/" }}
              activeProps={{ className: "!bg-white/60 dark:!bg-slate-700/60" }}
            >
              {option.label}
            </Link>
          ))}
          <Link
            to="/garden/stars"
            className="glass-button px-4 py-2 text-sm text-foreground/80 hover:text-foreground !rounded-full"
            activeProps={{ className: "!bg-white/60 dark:!bg-slate-700/60" }}
          >
            星港
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="glass-button p-2 text-foreground/80 hover:text-foreground"
            aria-label={m.nav_search()}
          >
            <Search size={18} strokeWidth={1.5} />
          </Link>
          <ThemeToggle />

          {isLoading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : user ? (
            <Link to="/profile" className="glass-button p-1" aria-label={user.name}>
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <UserIcon size={18} className="m-1" />
              )}
            </Link>
          ) : (
            <Link to="/login" className="glass-button px-4 py-2 text-sm">
              {m.nav_login()}
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={onMenuClick}
            className="md:hidden glass-button p-2"
            aria-label={m.common_open_menu()}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
