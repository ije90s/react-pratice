import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../context/UserContext";
import useMutation from "../hooks/useMutation";

interface Props {
  feedId: number;
  authorId: number | null; // 피드 작성자(user_id) — 작성자 계정이 삭제된 글이면 null
  challengeId: number | null; // 피드가 속한 챌린지 — 챌린지가 삭제된 피드면 null
}

// ChallengeOwnerActions와 같은 구조: 내 글일 때만 "수정/삭제", 삭제는 확인 dialog를 거친다.
function FeedOwnerActions({ feedId, authorId, challengeId }: Props) {
  const { me } = useMe();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mutate, submitting, error, setError } = useMutation();
  const isMine = me !== null && authorId !== null && me.id === authorId;

  async function handleDelete() {
    const result = await mutate<void>(`/feed/${feedId}`, { method: "DELETE" });
    if(!result.ok) return;
    const backTo = challengeId === null ? `/challenges` : `/challenges/${challengeId}?tab=feed`;
    navigate(backTo, { replace: true });
  }

  if (!isMine) return null;

  return (
    <div>
      <Link to={`/feeds/${feedId}/edit`}>수정</Link>{" "}
      <button onClick={() => dialogRef.current?.showModal()}>삭제</button>
      <dialog ref={dialogRef} onClose={() => setError("")}>
        <p>정말 삭제하시겠습니까?</p>
        {error && <p role="alert">{error}</p>}
        <button onClick={handleDelete} disabled={submitting}>
          {submitting ? "처리 중..." : "삭제"}
        </button>
        <button onClick={() => dialogRef.current?.close()} disabled={submitting}>
          취소
        </button>
      </dialog>
    </div>
  );
}

export default FeedOwnerActions;
