import { useState } from "react";
import useMutation from "../hooks/useMutation";
import type { Participation } from "../types/participation";
import RecordAddModal from "./RecordAddModal";

interface Props {
  challengeId: number;
  type: number; // 챌린지 유형 — 기록 추가 모달이 score/challenge_count 중 무엇을 보낼지 정하는 데 쓴다
  initialStatus: number | null; // 서버가 알려준 내 참가 상태 (null: 미참가, 0: 진행 중, 1: 완료, 2: 포기)
}

function ParticipationActions({ challengeId, type, initialStatus }: Props) {
  // 서버 값은 처음 한 번만 받고, 이후에는 요청 응답의 status로 직접 갱신한다(재조회 없음).
  const [status, setStatus] = useState<number | null>(initialStatus);
  const { mutate, submitting, error } = useMutation();

  async function handleClick() {
    let path = '', method = '';
    if (status === null){
      path = `/participation/challenge/${challengeId}`;
      method = "POST";
    }else{
      path = `/participation/challenge/${challengeId}/giveup`;
      method = "GET";
    }
    const result = await mutate<Participation>(path, { method });
    if (result.ok) setStatus(result.data.status);
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
      {/* 진행 중일 때만 기록을 더할 수 있다(포기 상태는 서버가 409). 목표를 채우면 응답 status가 1이 되어 위의 완료 안내로 바뀐다. */}
      {status === 0 && (
        <RecordAddModal
          challengeId={challengeId}
          type={type}
          onRecorded={(participation) => setStatus(participation.status)}
        />
      )}
    </div>
  );
}

export default ParticipationActions;
