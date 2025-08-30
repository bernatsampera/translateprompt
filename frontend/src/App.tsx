import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { SuperTokensWrapper } from "supertokens-auth-react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import TermsOfService from "./components/TermsOfService";
import type { FooterConfig, NavItem } from "./types/navigation";

import * as reactRouterDom from "react-router-dom";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import Dashboard from "./components/dashboard/Dashboard";
import { useAuth } from "./hooks";

// Navigation configuration
const topNavItems: NavItem[] = [
  // {
  //   label: "Home",
  //   href: "#home"
  // },
  // {
  //   label: "About",
  //   href: "#about"
  // },
  // {
  //   label: "Contact",
  //   href: "#contact"
  // }
];

// Footer configuration
const footerConfig: FooterConfig = {
  companyName: "TranslatePrompt",
  tagline: "Professional translation services powered by AI",
  madeWithText: "Made with",
  links: [
    {
      label: "Terms of Service",
      href: "/terms"
    }
    // {
    //   label: "Privacy Policy",
    //   href: "#privacy"
    // },
    // {
    //   label: "Support",
    //   href: "#support"
    // }
  ]
};

function App() {
  const {loggedIn, loading, logout} = useAuth();

  return (
    <SuperTokensWrapper>
      <Router>
        <div className="min-h-screen flex flex-col bg-base-100">
          <Header
            navItems={topNavItems}
            loggedIn={loggedIn}
            onLogout={logout}
          />

          <Routes>
            {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
              EmailPasswordPreBuiltUI
            ])}

            <Route path="/" element={loggedIn ? <Dashboard /> : <Home />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>

          <Footer {...footerConfig} />

          <Toaster richColors position="bottom-center" />
        </div>
      </Router>
    </SuperTokensWrapper>
  );
}

export default App;
