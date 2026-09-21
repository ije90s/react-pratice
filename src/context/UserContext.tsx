import { createContext, useContext, type ReactNode } from "react";
import useFetch from "../hooks/useFetch";
import { useAuth } from "./AuthContext";
import type { User } from "../types/user";

interface UserContextValue {
  me: User | null; // 내 정보 — 아직 모르거나(로딩 중, 로그아웃 상태) 조회에 실패하면 null
  loading: boolean;
  error: string;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

// AuthProvider 안쪽에 둔다 — useFetch가 useAuth()로 토큰을 읽기 때문이다.
export function UserProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  // 토큰이 없으면(path === null) 요청하지 않는다. 로그인해서 토큰이 생기면 path가 바뀌어 그때 조회한다.
  const { data, loading, error } = useFetch<User>(token ? "/user/me" : null);

  const me: User | null = (!token || loading) ? null : data;

  const value: UserContextValue = { me, loading, error };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useMe() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useMe는 UserProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
