import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthContextData {
  isLogged: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function useAuthProvider() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  const signIn = async () => {
    document.cookie = "token=true";
    setIsLogged(true);
    router.push("/profile");
  };

  const signOut = async () => {
    document.cookie = "token=false; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    setIsLogged(false);
    router.push("/");
  };

  useEffect(() => {
    if (document.cookie.includes("token")) {
      setIsLogged(true);
    }
  }, []);

  return {
    isLogged,
    signIn,
    signOut
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
