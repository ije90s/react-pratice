import { useState } from "react";
import useFetch from "../hooks/useFetch";
import type { PagingResponse } from "../types/paging";
import { STATUS_LABELS, type Participation } from "../types/participation";

const LIMIT = 10; // 백엔드 검증: limit은 최소 10

function MyParticipationSection() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch<PagingResponse<Participation>>(
    `/participation/challenge/mine?page=${page}&limit=${LIMIT}`,
  );
  const items = data?.items ?? [];
  const meta = data?.meta ?? null;

  let content;
  if (loading) {
    content = <p>불러오는 중...</p>;
  } else if (error) {
    content = <p>{error}</p>;
  } else if (items.length === 0) {
    content = <p>참가한 챌린지가 없습니다.</p>;
  } else {
    content = (
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            점수 {p.score} / 횟수 {p.challenge_count}{" "}
            <small>({STATUS_LABELS[p.status] ?? ""})</small>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      <h2>내 참가 기록{meta ? ` (${meta.total})` : ""}</h2>
      {/* 백엔드 mine 응답에는 challenge id/제목이 없어서 어느 챌린지인지 표시·링크할 수 없다 */}
      {content}
      {!loading && meta && (
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
    </section>
  );
}

export default MyParticipationSection;
