import axiosInstance from "@/api/axiosConfig";
import {useEffect, useState} from "react";
import {
  signOut,
  useSessionContext
} from "supertokens-auth-react/recipe/session";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const AUTH_BASE_URL = `${BASE_URL}/auth`;

export function useAuth() {
  const session = useSessionContext() as any; // For some reason the types are not working, but the variables are there

  const [userData, setUserData] = useState({
    email: null,
    loading: false, // This will now be our *user data* loading state
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      // The condition remains the same: fetch only when a session exists.
      if (session.doesSessionExist && session.userId) {
        setUserData((prev) => ({...prev, loading: true}));
        try {
          const response = await axiosInstance.get(`${AUTH_BASE_URL}/user`);
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
            setUserData({
              email: null,
              loading: false,
              error: error as any
            });
          }
        }
      } else {
        setUserData({email: null, loading: false, error: null});
      }
    };

    // We trigger the fetch when the session is loaded and exists.
    if (!session.loading) {
      fetchUserData();
    }

    return () => {
      isMounted = false;
    };
  }, [session.doesSessionExist, session.userId, session.loading]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const authLoading = session.loading;

  return {
    // This is for checking if we can render a protected route AT ALL.
    authLoading: authLoading,
    loggedIn: session.doesSessionExist,
    logout: handleLogout,
    userId: session.userId,

    // We'll pass the entire user object, including its own loading state.
    user: {
      email: userData.email,
      loading: userData.loading,
      error: userData.error
    }
  };
}
