import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import SuperTokens, {SuperTokensWrapper} from "supertokens-auth-react";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import SessionReact from "supertokens-auth-react/recipe/session";
import App from "./App.tsx";
import "./index.css";

SuperTokens.init({
  appInfo: {
    // learn more about this on https://supertokens.com/docs/references/frontend-sdks/reference#sdk-configuration
    appName: "TranslatePrompt",
    apiDomain: "localhost:8008",
    websiteDomain: "localhost:5178",
    apiBasePath: "/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    EmailPasswordReact.init({
      signInAndUpFeature: {
        signUpForm: {
          formFields: [
            {
              id: "username",
              label: "Username",
              placeholder: "username"
            }
          ]
        }
      }
    }),
    SessionReact.init()
  ]
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SuperTokensWrapper>
      <App />
    </SuperTokensWrapper>
  </StrictMode>
);
