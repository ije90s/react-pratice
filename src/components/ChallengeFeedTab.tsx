import { useState } from "react";
import { Link } from "react-router-dom";
import type { Feed } from "../types/feed";
import type { PagingResponse } from "../types/paging";
import useFetch from "../hooks/useFetch";

interface Props {
  challengeId: number;
}

const LIMIT = 10; // 백엔드 검증: limit은 최소 10

function ChallengeFeedTab({ challengeId }: Props) {
  const [page, setPage] = useState(1);

  const { data, loading, error} = useFetch<PagingResponse<Feed>>(`/feed/challenge/${challengeId}/feeds?page=${page}&limit=${LIMIT}`);
  const items = data?.items ?? [];
  const meta = data?.meta ?? null;

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  const writeLink = <Link to={`/challenges/${challengeId}/feeds/new`}>피드 작성</Link>;
  if (!meta || items.length === 0) {
    return (
      <div>
        <p>아직 피드가 없습니다.</p>
        {writeLink}
      </div>
    );
  }

  return (
    <div>
      {writeLink}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((feed) => (
          <li key={feed.id}>
            <Link to={`/feeds/${feed.id}`}>
              <strong>{feed.title}</strong>
            </Link>
            <p>{feed.content}</p>
            {feed.images && feed.images.length > 0 && (
              <small>사진 {feed.images.length}장</small>
            )}
          </li>
        ))}
      </ul>
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
  );
}

export default ChallengeFeedTab;
