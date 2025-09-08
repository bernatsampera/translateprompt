import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {Toaster} from "sonner";
import {SuperTokensWrapper} from "supertokens-auth-react";
import Home from "./components/Home";
import TermsOfService from "./components/TermsOfService";
import type {FooterConfig, NavItem} from "./types/navigation";

import * as reactRouterDom from "react-router-dom";
import {EmailPasswordPreBuiltUI} from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import {ThirdPartyPreBuiltUI} from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import {getSuperTokensRoutesForReactRouterDom} from "supertokens-auth-react/ui";
import AuthLayoutWrapper from "./components/auth/AuthLayoutWrapper";
import Dashboard from "./components/dashboard/Dashboard";
import {useAuth} from "./hooks";
import {DashboardLayout, MainLayout} from "./layouts";
import HowItWorks from "./pages/HowItWorks/index";
import Settings from "./pages/Settings";

// Navigation configuration
const topNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "How it Works",
    href: "how-it-works"
  }
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
  ]
};

// ... inside the App component

function App() {
  // We only need useAuth here for the AuthLayoutWrapper. If you can move that logic
  // inside the wrapper itself, you could remove this hook call from App.js entirely.
  const {loggedIn, logout} = useAuth();
  const authRoutes = getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
    EmailPasswordPreBuiltUI,
    ThirdPartyPreBuiltUI
  ]);

  const wrappedAuthRoutes = authRoutes.map((route, index) => (
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
  ));

  return (
    <SuperTokensWrapper>
      <Router>
        <Routes>
          {wrappedAuthRoutes}

          {/* --- THE NEW, CLEANED UP ROUTES --- */}

          {/* Root route is now handled by our special component */}
          <Route
            path="/"
            element={
              <RootRouteHandler
                navItems={topNavItems}
                footerConfig={footerConfig}
              />
            }
          />

          {/* All other dashboard/settings routes are protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                navItems={topNavItems}
                footerConfig={footerConfig}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute
                navItems={topNavItems}
                footerConfig={footerConfig}
              >
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Public routes remain simple */}
          <Route
            path="/how-it-works"
            element={
              <MainLayout
                navItems={topNavItems}
                footerConfig={footerConfig}
                loggedIn={loggedIn}
                onLogout={logout}
              >
                <HowItWorks />
              </MainLayout>
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

export const ContentSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

// components/auth/ProtectedRoute.jsx

import React from "react";
import {Navigate} from "react-router-dom";

// This component takes all the props that DashboardLayout needs
export const ProtectedRoute = ({
  children,
  navItems,
  footerConfig
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  footerConfig: FooterConfig;
}) => {
  const auth = useAuth();

  // 1. While the session is being verified, show the Dashboard layout shell
  // with a spinner inside. This provides an instant, familiar UI.
  if (auth.loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        footerConfig={footerConfig}
        loggedIn={true} // Assume loggedIn to show correct header state
        onLogout={auth.logout}
      >
        <ContentSpinner />
      </DashboardLayout>
    );
  }

  // 2. If loading is done and user is NOT logged in, redirect to the auth page.
  if (!auth.loggedIn) {
    return <Navigate to="/auth" replace />;
  }

  // 3. If loading is done and user IS logged in, show the actual protected content.
  return (
    <DashboardLayout
      navItems={navItems}
      footerConfig={footerConfig}
      loggedIn={auth.loggedIn}
      onLogout={auth.logout}
    >
      {children}
    </DashboardLayout>
  );
};

// components/RootRouteHandler.jsx

export const RootRouteHandler = ({
  navItems,
  footerConfig
}: {
  navItems: NavItem[];
  footerConfig: FooterConfig;
}) => {
  const auth = useAuth();

  // 1. While loading, show the Dashboard layout shell with a spinner.
  // This is the key to preventing the flicker for logged-in users.
  // A new user might see this for a split second, but the session check is very fast.
  // This is the best trade-off to solve the primary problem.
  if (auth.loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        footerConfig={footerConfig}
        loggedIn={true}
        onLogout={auth.logout}
      >
        <ContentSpinner />
      </DashboardLayout>
    );
  }

  // 2. Once loading is finished, decide which component to show.
  return auth.loggedIn ? (
    <DashboardLayout
      navItems={navItems}
      footerConfig={footerConfig}
      loggedIn={auth.loggedIn}
      onLogout={auth.logout}
    >
      <Dashboard />
    </DashboardLayout>
  ) : (
    <MainLayout
      navItems={navItems}
      footerConfig={footerConfig}
      loggedIn={auth.loggedIn}
      onLogout={auth.logout}
    >
      <Home />
    </MainLayout>
  );
};
