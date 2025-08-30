// hooks/useAuth.js (or wherever you define it)

import {
  signOut,
  useSessionContext
} from "supertokens-auth-react/recipe/session";

export function useAuth() {
  // useSessionContext provides real-time session information.
  // It's provided by the <SuperTokensWrapper> in your App component.
  const session = useSessionContext();

  const handleLogout = async () => {
    try {
      await signOut();
      // No need to call setLoggedIn(false) here.
      // The session context will automatically update after signOut,
      // triggering a re-render with loggedIn = false.
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  console.log(session);

  return {
    // session.loading is true during the initial session check.
    loading: session.loading,
    // session.doesSessionExist is the reactive boolean you need.
    // @ts-ignore
    loggedIn: session.doesSessionExist,
    logout: handleLogout,
    // You can also expose other useful info if needed
    // @ts-ignore
    userId: session.userId,
    // @ts-ignore
    userEmail: session.accessTokenPayload?.email
  };
}
