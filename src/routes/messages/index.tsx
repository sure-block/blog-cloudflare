import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/features/messages-page/components/messages-page";

export const Route = createFileRoute("/messages/")({
  ssr: false,
  component: MessagesRoute,
  loader: () => ({ title: "留言板" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});

function MessagesRoute() {
  return <MessagesPage />;
}
