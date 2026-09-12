import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowUp, CalendarDays, Clock3, Pencil } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import type { PostPageProps } from "@/features/theme/contract/pages";
import { ContentRenderer } from "@/features/theme/themes/default/components/content/content-renderer";
import { authClient } from "@/lib/auth/auth.client";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { CommentSection } from "@/features/theme/themes/default/components/comments/view/comment-section";
import { RelatedPosts, RelatedPostsSkeleton } from "./components/related-posts";

/** Sure 主题文章详情页 — 玻璃拟态 */
export function PostPage({ post }: PostPageProps) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-10 pb-20 py-6 md:py-10 flex flex-col gap-6">
      {/* Back / Edit */}
      <nav className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/posts" })}
          className="glass-button px-4 py-2 text-sm text-foreground/70 hover:text-foreground flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          {m.post_back_to_list()}
        </button>
        {session?.user.role === "admin" && (
          <Link
            to="/admin/posts/edit/$id"
            params={{ id: String(post.id) }}
            className="glass-button px-4 py-2 text-sm text-foreground/70 hover:text-foreground flex items-center gap-2"
          >
            <Pencil size={14} />
            {m.post_edit()}
          </Link>
        )}
      </nav>

      <article className="flex flex-col gap-6">
        {/* Header */}
        <header className="glass-card p-6 md:p-10 fade-in-up shadow-2xl">
          <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 size={13} />
              {m.read_time({ count: post.readTimeInMinutes })}
            </span>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to="/posts"
                    search={{ tagName: tag.name }}
                    className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="glass-card p-6 md:p-10 fade-in-up shadow-xl prose prose-slate dark:prose-invert max-w-none">
          <ContentRenderer content={post.contentJson} />
        </div>

        {/* Related */}
        <div className="fade-in-up">
          <Suspense fallback={<RelatedPostsSkeleton />}>
            <RelatedPosts slug={post.slug} />
          </Suspense>
        </div>

        {/* Comments */}
        <div className="glass-card p-6 md:p-8 fade-in-up shadow-xl">
          <CommentSection postId={post.id} />
        </div>
      </article>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 glass-button p-3 shadow-xl z-40"
          aria-label={m.post_back_to_top()}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
