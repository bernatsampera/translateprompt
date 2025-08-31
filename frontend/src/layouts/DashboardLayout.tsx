import type {ReactNode} from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type {FooterConfig, NavItem} from "../types/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  footerConfig: FooterConfig;
  loggedIn?: boolean;
  onLogout?: () => void;
}

function DashboardLayout({
  children,
  navItems,
  footerConfig,
  loggedIn = false,
  onLogout
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header navItems={navItems} loggedIn={loggedIn} onLogout={onLogout} />

      {/* Dashboard content area with minimal padding for work-focused design */}
      <main className="flex-1 flex flex-col px-2 py-2">{children}</main>

      <Footer {...footerConfig} />
    </div>
  );
}

export default DashboardLayout;
