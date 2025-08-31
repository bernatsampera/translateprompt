import type {ReactNode} from "react";
import {MainLayout} from "../../layouts";
import type {FooterConfig, NavItem} from "../../types/navigation";

interface AuthLayoutWrapperProps {
  children: ReactNode;
  navItems: NavItem[];
  footerConfig: FooterConfig;
  loggedIn?: boolean;
  onLogout?: () => void;
}

function AuthLayoutWrapper({
  children,
  navItems,
  footerConfig,
  loggedIn = false,
  onLogout
}: AuthLayoutWrapperProps) {
  return (
    <MainLayout
      navItems={navItems}
      footerConfig={footerConfig}
      loggedIn={loggedIn}
      onLogout={onLogout}
    >
      {children}
    </MainLayout>
  );
}

export default AuthLayoutWrapper;
