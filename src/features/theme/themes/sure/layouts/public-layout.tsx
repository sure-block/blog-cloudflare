import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { ToolboxMount } from "@/features/toolbox/components/toolbox-mount";
import { BackgroundLayer } from "../components/background-layer";
import { Footer } from "./footer";
import { MobileMenu } from "./mobile-menu";
import { Navbar } from "./navbar";

/** Sure 主题公共布局 — 玻璃拟态 */
export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sure-theme min-h-screen flex flex-col">
      <BackgroundLayer
        background={siteConfig.theme.sure?.background}
      />
      <Navbar
        navOptions={navOptions}
        onMenuClick={() => setIsMenuOpen(true)}
        user={user}
        isLoading={isSessionLoading}
      />
      <MobileMenu
        navOptions={navOptions}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        logout={logout}
      />
      <main className="flex-1 pt-24 md:pt-28">{children}</main>
      <Footer navOptions={navOptions} />
      <ToolboxMount />
    </div>
  );
}
