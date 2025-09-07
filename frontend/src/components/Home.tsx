import SystemExplanation from "./SystemExplanation";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className=" mt-16 lg:mt-32 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-base-content mb-6">
            Translate Prompt
          </h1>
          <p className="text-xl lg:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            The Translation App That Learns From You
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 lg:py-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SystemExplanation />
        </div>
      </section>

      {/* Coming Soon Section */}
      {/* <section className="py-16 lg:py-24 px-4 lg:px-8 bg-base-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-8">
            Coming Soon
          </h2>

          <div className="mb-12">
            <p className="text-lg text-base-content/70 mb-8">
              The full release will be available around September/October 2025.
            </p>
            <p className="text-lg text-base-content/70 mb-8">
              Coming Features:
            </p>
            <ul className="gap-6 max-w-2xl mx-auto mb-12 flex flex-col items-center flex-wrap justify-center">
              {features.map((feature, index) => (
                <li key={index} className="w-fit flex items-center gap-2 ">
                  <span className=""> • </span>
                  <h3 className="text-base font-semibold text-base-content">
                    {feature}
                  </h3>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-base-100 rounded-lg p-8 shadow-sm border border-base-300/50 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-base-content mb-6">
              Join the Waitlist
            </h3>
            <Waitlist />
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
