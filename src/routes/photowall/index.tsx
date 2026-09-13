import { createFileRoute } from "@tanstack/react-router";
import { PhotoWallPage } from "@/features/photowall/components/photowall-page";

export const Route = createFileRoute("/photowall/")({
  ssr: false,
  component: PhotoWallRoute,
  loader: () => ({ title: "照片墙" }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title }],
  }),
});

function PhotoWallRoute() {
  return <PhotoWallPage />;
}
