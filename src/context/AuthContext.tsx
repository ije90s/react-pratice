import { createContext, useState, useContext, type ReactNode } from "react";

const STORAGE_KEY = "challenge_api_token";

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO(human): 아래 세 가지를 구현하세요.
  // 1. `token` state를 만들되, 초기값은 `localStorage.getItem(STORAGE_KEY)`로 복원.
  // 2. `login(newToken)` — state를 갱신하고 localStorage에도 같은 값을 저장.
  // 3. `logout()` — state를 null로 만들고 localStorage에서 해당 키를 제거.
  // 9-3단계(Todo List localStorage 저장/복원)와 같은 패턴이지만,
  // 여기서는 값 하나(token)를 이 컴포넌트 트리 전체가 useAuth()로 꺼내 쓰게 되는 게 다른 점입니다.
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
