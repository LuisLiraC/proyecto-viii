import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthContextData {
  isLogged: boolean;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (newUser: newUser) => Promise<void>;
}

type Credentials = {
  email: string;
  password: string;
}

type newUser = {
  name: string;
  username: string;
  email: string;
  password: string;
}
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function useAuthProvider() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  const signIn = async (credentials: Credentials) => {
    const res = await fetch('/api/v1/auth/sign_in', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    document.cookie = `token=${data.token}`;
    setIsLogged(true);
    await router.push("/profile");
  };

  const signUp = async (newUser: newUser) => {
    const res = await fetch('/api/v1/auth/sign_up', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();

    document.cookie = `token=${data.token}`;
    setIsLogged(true);
    await router.push("/profile");
  };

  const signOut = async () => {
    document.cookie = "token=false; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    setIsLogged(false);
    await router.push("/");
  };

  useEffect(() => {
    if (document.cookie.includes("token")) {
      setIsLogged(true);
    }
  }, []);

  return {
    isLogged,
    signIn,
    signOut,
    signUp
  };
}

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
