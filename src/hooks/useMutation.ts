import { useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

// 실패를 undefined가 아니라 ok 플래그로 알린다 — DELETE처럼 성공 응답 자체가 undefined(204)일 수 있어서다.
export type MutationResult<T> = { ok: true; data: T } | { ok: false };

interface MutateOptions {
  method: string;
  body?: unknown;
}

// 버튼·폼 제출로 서버 상태를 바꾸는 요청의 공통 골격(submitting, error, try·catch·finally).
// useFetch와 달리 렌더링 때 자동으로 요청하지 않고, 호출한 쪽이 mutate()를 부를 때만 요청한다.
function useMutation() {
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function mutate<T>(path: string, { method, body }: MutateOptions): Promise<MutationResult<T>> {
    try {
      setSubmitting(true);
      setError("");

      const response = await apiFetch<T>(path, { method, token, body });
      return { ok: true, data: response };
    } catch(err){
      setError(err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.");
      return { ok: false };
    } finally {
      setSubmitting(false);
    }
  }

  // setError도 내보낸다 — 요청 전 입력 검증 실패, dialog 닫힘 시 초기화처럼 호출한 쪽이 직접 쓸 일이 있다.
  return { mutate, submitting, error, setError };
}

export default useMutation;
