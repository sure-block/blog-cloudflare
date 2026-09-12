import type { AuthLayoutProps } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";
import { BackgroundLayer } from "../components/background-layer";

/** Sure 主题认证布局 — 玻璃拟态居中卡片 */
export function AuthLayout({ onBack, children }: AuthLayoutProps) {
  return (
    <div className="sure-theme min-h-screen w-full flex flex-col relative">
      <BackgroundLayer />
      <header className="h-16 flex items-center px-6 md:px-12 relative z-10">
        <button
          onClick={onBack}
          type="button"
          className="glass-button px-4 py-2 text-sm text-foreground/70 hover:text-foreground"
        >
          ← {m.auth_layout_back_home()}
        </button>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md glass-card p-8 fade-in-up shadow-2xl">
          {children}
        </div>
      </main>

      <footer className="h-16" />
    </div>
  );
}
