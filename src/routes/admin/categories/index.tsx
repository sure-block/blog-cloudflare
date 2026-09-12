import { createFileRoute } from "@tanstack/react-router";
import { CategoryManager } from "@/features/categories/components/admin/category-manager";

export const Route = createFileRoute("/admin/categories/")({
  ssr: false,
  component: CategoryManagerRoute,
  loader: () => ({
    title: "分类管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function CategoryManagerRoute() {
  return <CategoryManager />;
}
