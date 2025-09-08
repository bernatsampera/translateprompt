import heroimg from "@/assets/howitworks/heroimg.webp";
import {Book, Edit, Notebook} from "lucide-react";
import SystemExplanation from "./SystemExplanation";

const Home = () => {
  return (
    <div className="min-h-screen ">
      {/* How It Works Section */}

      <section className="hero min-h-screen bg-base-100">
        <div className="hero-content flex-col lg:flex-row container mx-auto px-4">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              A Translator That Thinks Like You.
            </h1>
            <p className="py-6 text-lg sm:text-xl text-base-content/80">
              You correct it once. It learns forever.
            </p>
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-base-content/70 max-w-md mx-auto lg:mx-0">
                Stop settling for generic translations. Train your AI to
                understand your style, terminology, and preferences.
              </p>
              <a
                href="/auth"
                className="btn btn-primary btn-sm md:btn-md w-full sm:w-auto"
              >
                Start Training Your Translator
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
            {/* Placeholder for your main graphic/animation */}
            <div className="mockup-window border bg-base-300 w-full max-w-lg">
              <img
                src={heroimg}
                alt="Translate Prompt example"
                className="object-contain w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-16 px-4 lg:px-8 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <SystemExplanation />
        </div>
      </section>

      {/* --- 2. "How It Works" Banner --- */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left px-4">
            <h2 className="text-4xl font-bold">
              Trained by You, with the help of a small AI Agent.
            </h2>
            <p className="py-6 text-lg">
              Our AI Agent, built with LangGraph, learns from your feedback. You
              guide it, you improve it, you make it yours.
            </p>
            <a href="/how-it-works" className="btn btn-outline">
              See how it works
            </a>
          </div>
          <div className="flex justify-center items-center px-4">
            {/* Placeholder for your 'How it Works' graphic */}
            <div className="text-center p-2 md:p-8 bg-base-200 rounded-lg w-full max-w-md">
              <span className="font-mono text-lg">Custom Corrections</span>
              <span className="font-mono text-2xl mx-4"> →</span>
              <span className="font-mono text-lg font-bold">[AI Agent]</span>
              <span className="font-mono text-2xl mx-4"> →</span>
              <span className="font-mono text-lg">Custom Translations</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. Benefits Section --- */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-10 px-4">
            {/* Benefit 1 */}
            <div className="card bg-base-100 shadow-xl p-8">
              <div className="flex justify-center mb-4 text-primary">
                <Edit />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Correct your translations.
              </h3>
              <p>
                The AI used the wrong word or an expression you don't like.
                Write your change in the refine box. The translation is updated
                instantly.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="card bg-base-100 shadow-xl p-8">
              <div className="flex justify-center mb-4 text-primary">
                <Book />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Create your own glossary.
              </h3>
              <p>
                When you correct a word, the system asks to save it. Approve it,
                and the change is added to your personal glossary. It will be
                used every time.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="card bg-base-100 shadow-xl p-8">
              <div className="flex justify-center mb-4 text-primary">
                <Notebook />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Make your translation rules.
              </h3>
              <p>
                Set style rules for your AI. For example: "Always use *du*
                instead of *Sie* in German," or "Translate with a colloquial
                tone." The AI will obey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. Final Call-to-Action (CTA) Section --- */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Translations?
            </h2>
            <p className="text-lg sm:text-xl text-base-content/70 mb-8">
              Join thousands of users who've already personalized their AI
              translator. Start with a free account and see the difference in
              minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/auth" className="btn btn-primary btn-lg px-8">
                Get Started Free
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a href="/how-it-works" className="btn btn-outline btn-lg px-8">
                See How It Works
              </a>
            </div>
            <p className="text-sm text-base-content/60 mt-6">
              No credit card required • Premium plan available
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
