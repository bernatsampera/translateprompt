import TranslateGraph from "@/features/TranslateGraph";
import {useAuth} from "@/hooks/useAuth";

export default function Dashboard() {
  const {loggedIn, userEmail} = useAuth();
  return (
    <div className="max-w-7xl mx-auto py-8">
      {loggedIn && <p>Welcome {userEmail}</p>}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <TranslateGraph />
      </div>
    </div>
  );
}
