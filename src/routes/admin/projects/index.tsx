import { createFileRoute } from "@tanstack/react-router";
import { ProjectManager } from "@/features/projects/components/admin/project-manager";

export const Route = createFileRoute("/admin/projects/")({
  ssr: false,
  component: ProjectManagerRoute,
  loader: () => ({
    title: "项目展示管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function ProjectManagerRoute() {
  return <ProjectManager />;
}
