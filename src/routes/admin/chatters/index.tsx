import { createFileRoute } from "@tanstack/react-router";
import { ChatterManager } from "@/features/chatters/components/admin/chatter-manager";

export const Route = createFileRoute("/admin/chatters/")({
  ssr: false,
  component: ChatterManagerRoute,
  loader: () => ({
    title: "留言板管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function ChatterManagerRoute() {
  return <ChatterManager />;
}
