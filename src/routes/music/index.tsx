import { createFileRoute } from "@tanstack/react-router";
import { MusicPage } from "@/features/music-page/components/music-page";

export const Route = createFileRoute("/music/")({
  ssr: false,
  component: MusicRoute,
  loader: () => ({ title: "音乐" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});

function MusicRoute() {
  return <MusicPage />;
}
