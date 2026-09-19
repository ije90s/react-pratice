import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { Challenge } from "../types/challenge";
import type { PagingResponse } from "../types/paging";

const LIMIT = 10; // 백엔드 검증: limit은 최소 10

function ChallengeListPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch<PagingResponse<Challenge>>(
    `/challenge?page=${page}&limit=${LIMIT}`,
  );
  const challenges = data?.items ?? [];
  const meta = data?.meta ?? null;

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
