import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Challenge } from "../types/challenge";
import type { PagingMeta, PagingResponse } from "../types/paging";

const LIMIT = 10; // 백엔드 검증: limit은 최소 10

function ChallengeListPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [meta, setMeta] = useState<PagingMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchChallenges(){
      try{
        setLoading(true);
        setError("");
        const response = await apiFetch<PagingResponse<Challenge>>(
          `/challenge?page=${page}&limit=${LIMIT}`,
          { token },
        );
        if (cancelled) return;
        setChallenges(response.items);
        setMeta(response.meta);
      }catch(err){
        if(cancelled) return;
        setError(err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.");
      }finally {
        if(!cancelled) setLoading(false);
      }
    }
    fetchChallenges();
    return () => { cancelled = true; };
  }, [page, token]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>챌린지 목록</h1>
      <Link to="/challenges/new">새 챌린지</Link>
      <ul>
        {challenges.map((c) => (
          <li key={c.id}>
            <Link to={`/challenges/${c.id}`}>{c.title}</Link>{" "}
            <small>
              {c.start_date.slice(0, 10)} ~ {c.end_date.slice(0, 10)}
            </small>
          </li>
        ))}
      </ul>
      {meta && (
        <div>
          <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
            이전
          </button>
          <span>
            {" "}
            {meta.page} / {meta.totalPages}{" "}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default ChallengeListPage;
