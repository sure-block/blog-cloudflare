import { createFileRoute } from "@tanstack/react-router";
import { JsonPage } from "@/features/garden/components/json-page";

export const Route = createFileRoute("/garden/json/")({
  ssr: false,
  component: () => <JsonPage />,
  loader: () => ({ title: "JSON 格式化" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});
