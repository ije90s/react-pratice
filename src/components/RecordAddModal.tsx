import { useRef, useState, type FormEvent } from "react";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Participation } from "../types/participation";

interface Props {
  challengeId: number;
  type: number; // 챌린지 유형 — 0이면 score, 그 외에는 challenge_count를 늘린다
  onRecorded: (participation: Participation) => void; // 성공 시 갱신된 참가 정보를 부모에 넘긴다
}

function RecordAddModal({ challengeId, type, onRecorded }: Props) {
  const { token } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null); // 네이티브 <dialog> DOM 요소를 직접 가리킨다
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const unit = type === 0 ? "점" : "회";

  function open() {
    dialogRef.current?.showModal(); // 배경 차단·Esc 닫기·포커스 가둠을 브라우저가 처리한다
  }

  function close() {
    dialogRef.current?.close();
  }

  // Esc, 취소 버튼, close() 어느 경로로 닫혀도 dialog가 close 이벤트를 발생시킨다 — 입력 상태는 여기서 한 번만 비운다.
  function handleClosed() {
    setValue("");
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try{
      setSubmitting(true);
      setError("");
      const n = Number(value);
      if(!Number.isInteger(n) || n < 1){
        setError("입력값이 정확하지 않습니다.");
        return;
      }
      let body = {};
      if(type === 0){
        body = { score: n };
      }else{
        body = { challenge_count: n };
      }
      const response = await apiFetch<Participation>(`/participation/challenge/${challengeId}`, { method: "PATCH", token, body });
      onRecorded(response);
      close();
    } catch(err){
      setError(err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button onClick={open}>기록 추가</button>
      <dialog ref={dialogRef} onClose={handleClosed}>
        <form onSubmit={handleSubmit}>
          <h2>기록 추가</h2>
          <label>
            오늘 추가할 {type === 0 ? "점수" : "횟수"}({unit}){" "}
            <input
              type="number"
              min={1}
              step={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={submitting}
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <div>
            <button type="submit" disabled={submitting || value === ""}>
              {submitting ? "처리 중..." : "추가"}
            </button>
            <button type="button" onClick={close} disabled={submitting}>
              취소
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default RecordAddModal;
