import type {ReactNode} from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type {FooterConfig, NavItem} from "../types/navigation";

interface MainLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  footerConfig: FooterConfig;
  loggedIn?: boolean;
  onLogout?: () => void;
}

function MainLayout({
  children,
  navItems,
  footerConfig,
  loggedIn = false,
  onLogout
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header navItems={navItems} loggedIn={loggedIn} onLogout={onLogout} />

      {/* Main content area with full screen height */}
      <main className="flex-1 flex flex-col px-4 py-8">{children}</main>

      <Footer {...footerConfig} />
    </div>
  );
}

export default MainLayout;
