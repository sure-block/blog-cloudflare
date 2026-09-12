import { createFileRoute } from "@tanstack/react-router";
import { VisitorManager } from "@/features/visitors/components/admin/visitor-manager";

export const Route = createFileRoute("/admin/visitors/")({
  ssr: false,
  component: VisitorManagerRoute,
  loader: () => ({
    title: "访客统计",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function VisitorManagerRoute() {
  return <VisitorManager />;
}
