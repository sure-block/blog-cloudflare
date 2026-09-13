import { createFileRoute } from "@tanstack/react-router";
import { QrCodePage } from "@/features/garden/components/qrcode-page";

export const Route = createFileRoute("/garden/qrcode/")({
  ssr: false,
  component: () => <QrCodePage />,
  loader: () => ({ title: "二维码生成" }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title }] }),
});
