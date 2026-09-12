import { ClientOnly, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { SubmitFriendLinkPageProps } from "@/features/theme/contract/pages/friend-links";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { FriendLinkSubmitForm } from "@/features/theme/themes/default/pages/submit-friend-link/form";

/** Sure 主题提交友链页 — 玻璃拟态 */
export function SubmitFriendLinkPage(props: SubmitFriendLinkPageProps) {
  const { myLinks, form } = props;

  const statusLabel = (status: string) => {
    if (status === "approved") return m.friend_link_status_approved();
    if (status === "rejected") return m.friend_link_status_rejected();
    return m.friend_link_status_pending();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6">
      <header className="glass-card p-6 md:p-10 fade-in-up shadow-2xl">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {m.friend_links_title()}
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
              {m.friend_link_submit_desc()}
            </p>
          </div>
          <Link
            to="/"
            className="glass-button px-4 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 flex-shrink-0"
          >
            <ExternalLink size={14} />
            {m.profile_back_home()}
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 表单 */}
        <div className="lg:col-span-3 glass-card p-6 md:p-8 fade-in-up shadow-xl">
          <h3 className="font-serif text-lg font-bold text-foreground mb-6">
            {m.friend_link_submit_form_title()}
          </h3>
          <FriendLinkSubmitForm form={form} />
        </div>

        {/* 我的申请记录 */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 fade-in-up shadow-xl h-fit">
          <h3 className="font-serif text-lg font-bold text-foreground mb-6">
            {m.friend_link_my_submissions()}
          </h3>
          {myLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {m.friend_links_no_links()}
            </p>
          ) : (
            <div className="space-y-3">
              {myLinks.map((link) => (
                <div key={link.id} className="glass-button !rounded-xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground text-sm truncate">
                      {link.siteName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 flex-shrink-0">
                      {statusLabel(link.status)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{link.siteUrl}</span>
                    <ClientOnly fallback={<span>-</span>}>
                      <span className="flex-shrink-0 ml-2">
                        {formatDate(link.createdAt)}
                      </span>
                    </ClientOnly>
                  </div>
                  {link.status === "rejected" && link.rejectionReason && (
                    <p className="mt-2 text-xs text-destructive">
                      {link.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
