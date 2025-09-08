import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import SuperTokens, {SuperTokensWrapper} from "supertokens-auth-react";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import ThirdParty, {Google} from "supertokens-auth-react/recipe/thirdparty";
import App from "./App.tsx";
import "./index.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

SuperTokens.init({
  appInfo: {
    // learn more about this on https://supertokens.com/docs/references/frontend-sdks/reference#sdk-configuration
    appName: "TranslatePrompt",
    apiDomain: BACKEND_URL,
    websiteDomain: FRONTEND_URL,
    apiBasePath: "/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    Session.init(),

    EmailPasswordReact.init({}),
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [Google.init()]
      }
    })
  ]
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SuperTokensWrapper>
      <App />
    </SuperTokensWrapper>
  </StrictMode>
);
