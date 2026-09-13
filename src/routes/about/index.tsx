import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/features/about-page/components/about-page";

export const Route = createFileRoute("/about/")({
  ssr: false,
  component: AboutRoute,
  loader: () => ({ title: "关于" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});

function AboutRoute() {
  return <AboutPage />;
}
