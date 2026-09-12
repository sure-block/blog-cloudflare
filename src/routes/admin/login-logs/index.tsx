import { createFileRoute } from "@tanstack/react-router";
import { LoginLogManager } from "@/features/login-logs/components/admin/login-log-manager";

export const Route = createFileRoute("/admin/login-logs/")({
  ssr: false,
  component: LoginLogManagerRoute,
  loader: () => ({
    title: "登录日志",
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title,
      },
    ],
  }),
});

function LoginLogManagerRoute() {
  return <LoginLogManager />;
}
