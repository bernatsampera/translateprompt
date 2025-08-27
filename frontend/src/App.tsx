import {useRef} from "react";
import {Toaster} from "sonner";
import Footer from "./components/Footer";
import Header from "./components/Header";
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
  companyName: "CheapTranscript",
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
      <main className="flex-1 py-4 px-8 max-w-7xl w-full  mx-auto ">
        <TranslateGraph conversationIdRef={conversationIdRef} />
      </main>

      <Footer {...footerConfig} />

      <Toaster richColors position="bottom-center" />
    </div>
  );
}

export default App;
