// hooks/useAuth.js

import {useEffect, useState} from "react";
import {
  signOut,
  useSessionContext
} from "supertokens-auth-react/recipe/session";

import axiosInstance from "@/api/axiosConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const AUTH_BASE_URL = `${BASE_URL}/auth`;

export function useAuth() {
  const session = useSessionContext() as any;

  const [userData, setUserData] = useState({
    email: null,
    loading: false,
    error: null as any
  });

  useEffect(() => {
    // This flag prevents state updates if the component unmounts
    // during the async API call.
    let isMounted = true;

    const fetchUserData = async () => {
      // Only fetch if we have a confirmed session and user ID,
      // and we aren't already fetching.
      if (session.doesSessionExist && session.userId) {
        setUserData({email: null, loading: true, error: null});
        try {
          const response = await axiosInstance.get(`${AUTH_BASE_URL}/user`);
          console.log("response", response);
          if (isMounted) {
            setUserData({
              email: response.data.email,
              loading: false,
              error: null
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          if (isMounted) {
            setUserData({email: null, loading: false, error: error});
          }
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
    // This effect should ONLY re-run when the user's session status or ID changes.
  }, [session.doesSessionExist, session.userId]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // The final loading state is true if the session is loading OR our user data is loading.
  const isLoading = session.loading || userData.loading;

  return {
    loading: isLoading,
    loggedIn: session.doesSessionExist,
    logout: handleLogout,
    userId: session.userId,
    email: userData.email,
    error: userData.error // Expose error state for UI to optionally use
  };
}
