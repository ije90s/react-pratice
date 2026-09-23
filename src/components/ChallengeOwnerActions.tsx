import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../context/UserContext";
import useMutation from "../hooks/useMutation";

interface Props {
  challengeId: number;
  authorId: number | null; // 작성자 id — 작성자 계정이 삭제된 글이면 null
}

// 내 글일 때만 "수정/삭제"를 보여준다. 서버도 남의 글이면 403을 주지만, 눌러볼 수 있는 버튼 자체를 숨기는 것이 목적이다.
function ChallengeOwnerActions({ challengeId, authorId }: Props) {
  const { me } = useMe();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mutate, submitting, error, setError } = useMutation();
  const isMine = me !== null && authorId !== null && me.id === authorId;

  async function handleDelete() {
    const result = await mutate<void>(`/challenge/${challengeId}`, { method: "DELETE" });
    if (!result.ok) return;
    // 삭제된 글의 상세로 뒤로가기 하면 "존재하지 않는 챌린지"가 보이므로 히스토리에 남기지 않는다.
    navigate("/challenges", { replace: true });
  }

  if (!isMine) return null;

  return (
    <div>
      <Link to={`/challenges/${challengeId}/edit`}>수정</Link>{" "}
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

export default ChallengeOwnerActions;
