import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {doesSessionExist, signOut} from "supertokens-auth-react/recipe/session";

export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // check if a session exists
    async function checkSession() {
      const session = await doesSessionExist();
      setLoggedIn(session);
    }
    checkSession();
  }, []);

  if (!loggedIn) {
    // show login/signup UI
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>not logged in</p>
        <Link to="/auth" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  // show "logged in" UI
  return (
    <div>
      <h1>Welcome! You are logged in 🎉</h1>
      <button
        onClick={async () => {
          await signOut();
          setLoggedIn(false);
        }}
      >
        Logout
      </button>
    </div>
  );
}
