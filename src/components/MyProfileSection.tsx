import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/user";

function MyProfileSection() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchUser() {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch<User>("/user/me", { token });
        if (cancelled) return;
        setUser(response);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <section>
      <h2>내 정보</h2>
      {loading && <p>불러오는 중...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && user && <p>{user.email}</p>}
      <button onClick={logout}>로그아웃</button>
    </section>
  );
}

export default MyProfileSection;
