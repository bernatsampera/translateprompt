import {useRef} from "react";
import {Toaster} from "sonner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SystemExplanation from "./components/SystemExplanation";
import TranslateGraph from "./features/TranslateGraph";
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
    // {
    //   label: "Privacy Policy",
    //   href: "#privacy"
    // },
    // {
    //   label: "Terms of Service",
    //   href: "#terms"
    // },
    // {
    //   label: "Support",
    //   href: "#support"
    // }
  ]
};

function App() {
  const conversationIdRef = useRef<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header navItems={topNavItems} />

      {/* Main Content */}
      <main className="flex-1 py-6 lg:py-12 px-4 lg:px-8 max-w-7xl w-full mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-16">
          <h1 className="text-3xl lg:text-5xl font-bold text-base-content mb-4">
            Translate Prompt
          </h1>
          <p className="text-lg lg:text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed px-4">
            AI-powered translation with automatic glossary
          </p>
        </div>

        {/* System Explanation */}
        <div className="mb-16 lg:mb-32">
          <SystemExplanation />
        </div>

        {/* Translation Interface */}
        <div className="mb-16 lg:mb-20">
          <TranslateGraph conversationIdRef={conversationIdRef} />
        </div>
      </main>

      <Footer {...footerConfig} />

      <Toaster richColors position="bottom-center" />
    </div>
  );
}

export default App;
