import { createFileRoute } from "@tanstack/react-router";
import { UserManager } from "@/features/users/components/admin/user-manager";

export const Route = createFileRoute("/admin/users/")({
  ssr: false,
  component: UserManagerRoute,
  loader: () => ({
    title: "用户管理",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function UserManagerRoute() {
  return <UserManager />;
}
