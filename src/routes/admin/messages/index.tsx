import { createFileRoute } from "@tanstack/react-router";
import { MessageManager } from "@/features/messages/components/admin/message-manager";

export const Route = createFileRoute("/admin/messages/")({
  ssr: false,
  component: MessageManagerRoute,
  loader: () => ({
    title: "留言消息管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function MessageManagerRoute() {
  return <MessageManager />;
}
