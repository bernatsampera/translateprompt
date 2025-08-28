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
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-base-content mb-6">
            Translate Prompt
          </h1>
          <p className="text-xl lg:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            AI-powered translation with automatic glossary
          </p>
        </div>
      </section>

      {/* Translation Interface Section */}
      <section className="py-8 lg:py-10 px-4 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <TranslateGraph conversationIdRef={conversationIdRef} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-6">
              How It Works
            </h2>
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Our intelligent translation system learns from your corrections to
              build a personalized glossary
            </p>
          </div>

          <SystemExplanation />
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 bg-base-200/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-8">
            Coming Soon
          </h2>

          <div className="mb-12">
            <p className="text-lg text-base-content/70 mb-8">
              The full release will be available around September/October 2025
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-light text-primary/40 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-base font-semibold text-base-content">
                      {feature}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-8 shadow-sm border border-base-300/50 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-base-content mb-6">
              Join the Waitlist
            </h3>
            <Waitlist />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
