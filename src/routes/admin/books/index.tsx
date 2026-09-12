import { createFileRoute } from "@tanstack/react-router";
import { BookManager } from "@/features/books/components/admin/book-manager";

export const Route = createFileRoute("/admin/books/")({
  ssr: false,
  component: BookManagerRoute,
  loader: () => ({
    title: "书籍管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function BookManagerRoute() {
  return <BookManager />;
}
