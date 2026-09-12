import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { FriendLinksPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

/** Sure 主题友链页 — 玻璃拟态 */
export function FriendLinksPage({ links }: FriendLinksPageProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6">
      <header className="glass-card p-6 md:p-10 fade-in-up shadow-2xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          {m.friend_links_title()}
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
          {m.friend_links_desc()}
        </p>
      </header>

      {links.length === 0 ? (
        <div className="glass-card p-16 text-center shadow-lg">
          <p className="font-serif text-lg text-muted-foreground">
            {m.friend_links_no_links()}
          </p>
          <p className="mt-2 text-sm text-muted-foreground/60">
            {m.friend_links_first_link()}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="glass-card p-5 hover-lift shadow-lg group"
            >
              <div className="flex items-center gap-4">
                {link.logoUrl ? (
                  <img
                    src={link.logoUrl}
                    alt={link.siteName}
                    className="w-12 h-12 rounded-full object-cover gradient-ring p-[2px]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center font-serif text-lg text-gradient">
                    {link.siteName?.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground truncate flex items-center gap-1.5 group-hover:text-gradient transition-all">
                    {link.siteName}
                    <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100" />
                  </h3>
                  {link.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {link.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Submit CTA */}
      <div className="glass-card p-6 md:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-medium text-foreground">
            {m.friend_links_join_title()}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {m.friend_links_join_desc()}
          </p>
        </div>
        <Link
          to="/submit-friend-link"
          className="glass-button px-6 py-2.5 text-sm text-foreground flex-shrink-0 !bg-indigo-500/15 hover:!bg-indigo-500/25"
        >
          {m.friend_links_apply()}
        </Link>
      </div>
    </div>
  );
}
