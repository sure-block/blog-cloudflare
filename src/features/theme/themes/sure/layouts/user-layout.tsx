import { Link } from "@tanstack/react-router";
import type { UserLayoutProps } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";
import { BackgroundLayer } from "../components/background-layer";

/** Sure 主题用户布局 — 玻璃拟态 */
export function UserLayout({ isAuthenticated, children }: UserLayoutProps) {
  return (
    <div className="sure-theme min-h-screen font-sans relative antialiased">
      <BackgroundLayer />

      {isAuthenticated ? (
        <main className="relative z-10 px-4 sm:px-10 pt-24 md:pt-28 max-w-6xl mx-auto">
          {children}
        </main>
      ) : (
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="max-w-md w-full space-y-8 text-center glass-card p-8 fade-in-up shadow-2xl">
            <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
              {m.auth_layout_login_required()}
            </h1>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              {m.auth_layout_login_required_desc()}
            </p>
            <div className="flex items-center justify-center gap-6 pt-4">
              <Link
                to="/login"
                className="glass-button px-5 py-2.5 text-sm text-foreground"
              >
                {m.auth_layout_go_to_login()}
              </Link>
              <Link
                to="/"
                className="glass-button px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {m.auth_layout_back_home()}
              </Link>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
