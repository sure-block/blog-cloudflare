import { createFileRoute } from "@tanstack/react-router";
import { AlbumManager } from "@/features/albums/components/admin/album-manager";

export const Route = createFileRoute("/admin/albums/")({
  ssr: false,
  component: AlbumManagerRoute,
  loader: () => ({
    title: "相册管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function AlbumManagerRoute() {
  return <AlbumManager />;
}
