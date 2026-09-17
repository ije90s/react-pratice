import { createContext, useState, useContext, type ReactNode } from "react";

const STORAGE_KEY = "challenge_api_token";

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY));
  function login(newToken: string){
    if(newToken){
      setToken(newToken);
      localStorage.setItem(STORAGE_KEY, newToken);
    }
  }
  function logout(){
    if(token){
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
    }
  }
  const value: AuthContextValue = { token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
