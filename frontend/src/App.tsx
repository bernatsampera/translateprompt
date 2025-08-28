import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {Toaster} from "sonner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import TermsOfService from "./components/TermsOfService";
import type {FooterConfig, NavItem} from "./types/navigation";

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
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-base-100">
        <Header navItems={topNavItems} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>

        <Footer {...footerConfig} />

        <Toaster richColors position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;
