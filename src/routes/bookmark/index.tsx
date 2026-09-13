import { createFileRoute } from "@tanstack/react-router";
import { BookmarkPage } from "@/features/bookmark-page/components/bookmark-page";

export const Route = createFileRoute("/bookmark/")({
  ssr: false,
  component: BookmarkRoute,
  loader: () => ({ title: "书签" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});

function BookmarkRoute() {
  return <BookmarkPage />;
}
