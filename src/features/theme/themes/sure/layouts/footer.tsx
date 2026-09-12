import { Link, useRouteContext } from "@tanstack/react-router";
import type { NavOption } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";

interface FooterProps {
  navOptions: Array<NavOption>;
}

/** Sure 主题页脚 — 玻璃拟态 */
export function Footer({ navOptions }: FooterProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });

  return (
    <footer className="mt-auto">
      <div className="glass-card !rounded-b-none mx-4 sm:mx-10 max-w-6xl lg:mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-serif text-lg font-bold text-gradient">
              {siteConfig.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {siteConfig.description}
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap items-center justify-center gap-4">
            {navOptions.map((option) => (
              <Link
                key={option.id}
                to={option.to}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                {option.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-border/30 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.author} ·{" "}
          {m.footer_powered_by()}{" "}
          <span className="text-foreground/60">
            Cloudflare Workers · D1 · R2
          </span>
        </div>
      </div>
    </footer>
  );
}
