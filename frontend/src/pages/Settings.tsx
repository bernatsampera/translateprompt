import {getUserDetails, type UserDetails} from "@/api/userApi";
import UpgradeButtons from "@/components/UpgradeButtons";
import UserAccountDetails from "@/components/UserAccountDetails";
import {useAuth} from "@/hooks/useAuth";
import React from "react";

/**
 * Hook to fetch and manage user details
 */
const useUserDetails = (loggedIn: boolean) => {
  const [user, setUser] = React.useState<UserDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserDetails();
        setUser(response);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [loggedIn]);

  return {user, loading, error};
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-64"></div>
    </div>
  </div>
);

/**
 * Not logged in state component
 */
const NotLoggedInState: React.FC = () => (
  <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <p className="text-yellow-800">
        Please log in to view your settings and account details.
      </p>
    </div>
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{error: string}> = ({error}) => (
  <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <p className="text-red-800">{error}</p>
    </div>
  </div>
);

/**
 * Main Settings component
 */
const Settings: React.FC = () => {
  const {loggedIn, email} = useAuth();
  const {user, loading, error} = useUserDetails(loggedIn);

  // Handle different states
  if (!loggedIn) {
    return <NotLoggedInState />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!user) {
    return <ErrorState error="No user data available" />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <UserAccountDetails user={user} email={email || ""} />
        <UpgradeButtons user={user} />
      </div>
    </div>
  );
};

export default Settings;
