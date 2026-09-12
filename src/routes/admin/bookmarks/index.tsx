import { createFileRoute } from "@tanstack/react-router";
import { BookmarkManager } from "@/features/bookmarks/components/admin/bookmark-manager";

export const Route = createFileRoute("/admin/bookmarks/")({
  ssr: false,
  component: BookmarkManagerRoute,
  loader: () => ({
    title: "书签管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function BookmarkManagerRoute() {
  return <BookmarkManager />;
}
