import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { PagingMeta, PagingResponse } from "../types/paging";
import { STATUS_LABELS, type Participation } from "../types/participation";

interface Props {
  challengeId: number;
  type: number; // 챌린지 유형 — 0이면 score 기준, 그 외에는 challenge_count 기준으로 서버가 정렬
}

interface RankRow {
  rank: number;
  value: number;
  unit: string;
  statusLabel: string;
}

const LIMIT = 10; // 백엔드 검증: limit은 최소 10 (랭킹은 서버가 상위 100위까지만 노출)

function toRankRow(
  item: Participation,
  index: number,
  meta: PagingMeta,
  type: number,
): RankRow {
  return {
    rank: (meta.page-1) * meta.limit + index + 1,
    value: type === 0 ? item.score : item.challenge_count,
    unit: type === 0 ? "점" : "회",
    statusLabel: STATUS_LABELS[item.status] ?? "",
  };
}

function ChallengeRankTab({ challengeId, type }: Props) {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Participation[]>([]);
  const [meta, setMeta] = useState<PagingMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchRank() {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch<PagingResponse<Participation>>(
          `/participation/challenge/${challengeId}/rank?page=${page}&limit=${LIMIT}`,
          { token },
        );
        if (cancelled) return;
        setItems(response.items);
        setMeta(response.meta);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRank();
    return () => {
      cancelled = true;
    };
  }, [challengeId, page, token]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!meta || items.length === 0) return <p>아직 참가자가 없습니다.</p>;

  return (
    <div>
      <ol style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => {
          const row = toRankRow(item, index, meta, type);
          return (
            <li key={item.id}>
              <strong>{row.rank}위</strong> {row.value}
              {row.unit} <small>({row.statusLabel})</small>
            </li>
          );
        })}
      </ol>
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

export default ChallengeRankTab;
