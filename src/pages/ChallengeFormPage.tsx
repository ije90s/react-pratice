import { Link, useNavigate, useParams } from "react-router-dom";
import ChallengeForm, { type ChallengeFormValues } from "../components/ChallengeForm";
import useFetch from "../hooks/useFetch";
import type { Challenge, ChallengeInput } from "../types/challenge";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

// 서버의 날짜는 ISO 문자열("2026-09-20T00:00:00.000Z") — <input type="date">는 앞 10자리만 받는다.
function toFormValues(challenge: Challenge): ChallengeFormValues {
  return {
    type: String(challenge.type),
    mininum_count: String(challenge.mininum_count),
    title: challenge.title,
    content: challenge.content,
    start_date: challenge.start_date.slice(0, 10),
    end_date: challenge.end_date.slice(0, 10),
  };
}

function ChallengeFormPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams(); // 있으면 수정 모드(/challenges/:id/edit), 없으면 생성 모드(/challenges/new)
  const isEdit = id !== undefined;
  const { data: challenge, loading, error } = useFetch<Challenge | null>(
    isEdit ? `/challenge/${id}` : null,
  );

  async function handleSubmit(input: ChallengeInput) {
    const path = isEdit ? `/challenge/${id}` : `/challenge`;
    const method = isEdit ? "PATCH" : "POST";
    const response = await apiFetch<Challenge>(path, { method, token, body: input });
    navigate(`/challenges/${isEdit ? id : response.id}`, {replace: true});
  }

  if (isEdit && loading) return <p>불러오는 중...</p>;
  if (isEdit && error) return <p>{error}</p>;
  if (isEdit && !challenge) return <p>존재하지 않는 챌린지입니다.</p>;

  return (
    <div>
      <Link to={isEdit ? `/challenges/${id}` : "/challenges"}>← 취소</Link>
      <h1>{isEdit ? "챌린지 수정" : "챌린지 만들기"}</h1>
      <ChallengeForm
        key={id ?? "new"}
        initialValues={challenge ? toFormValues(challenge) : undefined}
        submitLabel={isEdit ? "수정" : "만들기"}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default ChallengeFormPage;
