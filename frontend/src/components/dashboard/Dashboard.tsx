import TranslateGraph from "@/features/TranslateGraph";
import {useAuth} from "@/hooks/useAuth";

export default function Dashboard() {
  const {loggedIn, userName} = useAuth();
  return (
    <div className="max-w-7xl mx-auto h-full">
      {loggedIn && <p className="mb-4">Welcome {userName}</p>}
      <div className="flex flex-col items-center justify-center h-full">
        <TranslateGraph />
      </div>
    </div>
  );
}
