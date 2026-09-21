import { useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Participation } from "../types/participation";

interface Props {
  challengeId: number;
  initialStatus: number | null; // 서버가 알려준 내 참가 상태 (null: 미참가, 0: 진행 중, 1: 완료, 2: 포기)
}

function ParticipationActions({ challengeId, initialStatus }: Props) {
  const { token } = useAuth();
  // 서버 값은 처음 한 번만 받고, 이후에는 요청 응답의 status로 직접 갱신한다(재조회 없음).
  const [status, setStatus] = useState<number | null>(initialStatus);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    try{
      setSubmitting(true);
      setError("");
      let path = '', method = '';
      if (status === null){
        path = `/participation/challenge/${challengeId}`;
        method = "POST";
      }else{
        path = `/participation/challenge/${challengeId}/giveup`;
        method = "GET";
      }
      const response = await apiFetch<Participation>(path, { method, token});
      setStatus(response.status);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  // 완료(1)면 더 할 수 있는 액션이 없다 — giveup도 서버가 409로 막는다.
  if (status === 1) return <p>챌린지를 완료했습니다.</p>;

  const label = status === null ? "참가하기" : status === 0 ? "포기하기" : "다시 참여하기";

  return (
    <div>
      <button onClick={handleClick} disabled={submitting}>
        {submitting ? "처리 중..." : label}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default ParticipationActions;
