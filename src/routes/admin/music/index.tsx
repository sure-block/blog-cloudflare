import { createFileRoute } from "@tanstack/react-router";
import { MusicManager } from "@/features/music/components/admin/music-manager";

export const Route = createFileRoute("/admin/music/")({
  ssr: false,
  component: MusicManagerRoute,
  loader: () => ({
    title: "音乐管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function MusicManagerRoute() {
  return <MusicManager />;
}
