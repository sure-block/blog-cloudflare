import { createFileRoute } from "@tanstack/react-router";
import { StarsPage } from "@/features/toolbox/components/stars/stars-page";

export const Route = createFileRoute("/garden/stars/")({
  ssr: false,
  component: StarsPageRoute,
  loader: () => ({
    title: "星港 · 3D 太阳系",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function StarsPageRoute() {
  return <StarsPage />;
}
