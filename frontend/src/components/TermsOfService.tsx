import {Link} from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link
            to="/"
            className="text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-base-content mb-8">
            Terms of Service
          </h1>

          <div className="space-y-6 text-base-content/80">
            <section>
              <h2 className="text-xl font-semibold text-base-content mb-3">
                Email Collection for Waitlist
              </h2>
              <p>
                We collect your email address solely for the purpose of
                notifying you when TranslatePrompt becomes available. By joining
                our waitlist, you agree to receive updates about our product
                launch and related announcements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-base-content mb-3">
                Data Usage
              </h2>
              <p>Your email address will be used exclusively to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Notify you when TranslatePrompt is available for use</li>
                <li>Send important updates about the service</li>
                <li>Provide early access information if applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-base-content mb-3">
                AI-Powered Translation Service
              </h2>
              <p>
                TranslatePrompt uses artificial intelligence models from Google
                and OpenAI to provide translation services. By using our
                service, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Text you submit for translation may be processed by
                  third-party AI services
                </li>
                <li>
                  We use Google's AI models and OpenAI's models to generate
                  translations
                </li>
                <li>
                  These AI providers may process your content according to their
                  own terms of service
                </li>
                <li>
                  AI-generated translations may not always be 100% accurate
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-base-content mb-3">
                Content and Data Processing
              </h2>
              <p>When you use TranslatePrompt's translation features:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Text submitted for translation is processed by AI models to
                  generate results
                </li>
                <li>We do not store your translation content permanently</li>
                <li>
                  Do not submit confidential, sensitive, or proprietary
                  information
                </li>
                <li>You retain ownership of content you submit</li>
                <li>
                  You are responsible for ensuring you have rights to translate
                  submitted content
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-base-content mb-3">
                Data Protection
              </h2>
              <p>
                We will not share, sell, or distribute your email address to
                third parties. You may unsubscribe from our communications at
                any time by contacting us or using the unsubscribe link in our
                emails.
              </p>
              <p className="mt-3">
                For translation processing, text data is sent to AI service
                providers (Google and OpenAI) as necessary for the service to
                function. This data is processed according to their respective
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-base-content mb-3">
                Service Limitations and Disclaimers
              </h2>
              <p>
                TranslatePrompt is provided "as is" for beta testing purposes.
                We make no warranties about the accuracy, reliability, or
                completeness of AI-generated translations.
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mt-3">
                <li>
                  Translation quality may vary and should be reviewed before use
                </li>
                <li>
                  Service availability is not guaranteed during beta period
                </li>
                <li>
                  We are not liable for any damages resulting from translation
                  errors
                </li>
                <li>
                  Users should verify important translations independently
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-base-content mb-3">
                Contact
              </h2>
              <p>
                If you have any questions about these terms or our data
                practices, please contact us through our website.
              </p>
            </section>

            <div className="border-t border-base-300 pt-6 mt-8">
              <p className="text-sm text-base-content/60">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
