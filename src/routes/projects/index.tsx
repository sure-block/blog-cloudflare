import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/features/projects-page/components/projects-page";

export const Route = createFileRoute("/projects/")({
  ssr: false,
  component: ProjectsRoute,
  loader: () => ({ title: "项目" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});

function ProjectsRoute() {
  return <ProjectsPage />;
}
