import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {Toaster} from "sonner";
import {SuperTokensWrapper} from "supertokens-auth-react";
import Home from "./components/Home";
import TermsOfService from "./components/TermsOfService";
import type {FooterConfig, NavItem} from "./types/navigation";

import * as reactRouterDom from "react-router-dom";
import {EmailPasswordPreBuiltUI} from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import {getSuperTokensRoutesForReactRouterDom} from "supertokens-auth-react/ui";
import AuthLayoutWrapper from "./components/auth/AuthLayoutWrapper";
import Dashboard from "./components/dashboard/Dashboard";
import {useAuth} from "./hooks";
import {DashboardLayout, MainLayout} from "./layouts";
import Settings from "./pages/Settings";

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
  const {loggedIn, logout} = useAuth();

  // Get SuperTokens routes and wrap them with MainLayout
  const authRoutes = getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
    EmailPasswordPreBuiltUI
  ]);

  // Wrap each auth route with MainLayout
  const wrappedAuthRoutes = authRoutes.map((route, index) => {
    return (
      <Route
        key={`auth-${index}`}
        path={route.props.path}
        element={
          <AuthLayoutWrapper
            navItems={topNavItems}
            footerConfig={footerConfig}
            loggedIn={loggedIn}
            onLogout={logout}
          >
            {route.props.element}
          </AuthLayoutWrapper>
        }
      />
    );
  });

  return (
    <SuperTokensWrapper>
      <Router>
        <Routes>
          {wrappedAuthRoutes}

          {/* Dashboard routes - using DashboardLayout */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                navItems={topNavItems}
                footerConfig={footerConfig}
                loggedIn={loggedIn}
                onLogout={logout}
              >
                <Dashboard />
              </DashboardLayout>
            }
          />

          {/* Main routes - using MainLayout */}
          <Route
            path="/"
            element={
              loggedIn ? (
                <DashboardLayout
                  navItems={topNavItems}
                  footerConfig={footerConfig}
                  loggedIn={loggedIn}
                  onLogout={logout}
                >
                  <Dashboard />
                </DashboardLayout>
              ) : (
                <MainLayout
                  navItems={topNavItems}
                  footerConfig={footerConfig}
                  loggedIn={loggedIn}
                  onLogout={logout}
                >
                  <Home />
                </MainLayout>
              )
            }
          />

          <Route
            path="/settings"
            element={
              <DashboardLayout
                navItems={topNavItems}
                footerConfig={footerConfig}
                loggedIn={loggedIn}
                onLogout={logout}
              >
                <Settings />
              </DashboardLayout>
            }
          />

          <Route
            path="/terms"
            element={
              <MainLayout
                navItems={topNavItems}
                footerConfig={footerConfig}
                loggedIn={loggedIn}
                onLogout={logout}
              >
                <TermsOfService />
              </MainLayout>
            }
          />
        </Routes>

        <Toaster richColors position="bottom-center" />
      </Router>
    </SuperTokensWrapper>
  );
}

export default App;
