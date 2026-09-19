import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

// path가 null이면 요청을 보내지 않는다(아직 요청할 수 없는 상태를 표현하기 위한 값).
function useFetch<T>(path: string | null): UseFetchResult<T> {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(path !== null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function getData() {
      if (path === null) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
  
      try {
        const response = await apiFetch<T>(path, { token });
        if (cancelled) return;
        setData(response);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void getData();
    return () => {
      cancelled = true;
    };
  }, [path, token]);

  return { data, loading, error };
}

export default useFetch;
