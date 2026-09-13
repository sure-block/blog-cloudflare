import { createFileRoute } from "@tanstack/react-router";
import { TimelinePage } from "@/features/timeline/components/timeline-page";

export const Route = createFileRoute("/timeline/")({
  ssr: false,
  component: TimelineRoute,
  loader: () => ({ title: "时间线" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});

function TimelineRoute() {
  return <TimelinePage />;
}
