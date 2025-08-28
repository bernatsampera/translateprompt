import {useRef} from "react";
import TranslateGraph from "../features/TranslateGraph";
import SystemExplanation from "./SystemExplanation";
import Waitlist from "./Waitlist";

const features = [
  "Create a custom glossary",
  "Host on your own server",
  "Set personalized instructions",
  "Integrate via API"
];

const Home = () => {
  const conversationIdRef = useRef<string | null>(null);

  return (
    <>
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

        {/* Translation Interface */}
        <div className="">
          <TranslateGraph conversationIdRef={conversationIdRef} />
        </div>
      </main>

      {/* System Explanation */}
      <div className="mb-16 lg:mb-32">
        <SystemExplanation />
      </div>

      <div className="mb-16 lg:mb-32 flex flex-col items-center justify-center">
        <div className="text-center text-lg font-semibold mb-4">
          Join the waitlist
          <p className="text-base-content/70 text-sm">
            The release will be around September/October 2025.
            <br />
            <ul className="py-3">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="group border-b border-base-300 last:border-b-0"
                >
                  <div className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 cursor-pointer">
                    <div className="text-xl font-extralight text-primary/20 group-hover:text-primary/40 tabular-nums transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors duration-300">
                        {feature}
                      </h3>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </p>
        </div>
        <Waitlist />
      </div>
    </>
  );
};

export default Home;
