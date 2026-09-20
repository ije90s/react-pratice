import { Link, useNavigate, useParams } from "react-router-dom";
import FeedForm from "../components/FeedForm";
import useFetch from "../hooks/useFetch";
import type { Feed, FeedInput } from "../types/feed";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

function FeedFormPage() {
  // 작성: /challenges/:id/feeds/new (id = 챌린지 id), 수정: /feeds/:feedId/edit
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id, feedId } = useParams();
  const isEdit = feedId !== undefined;
  const { data: feed, loading, error } = useFetch<Feed | null>(
    isEdit ? `/feed/${feedId}` : null,
  );
  const challengeId = isEdit ? feed?.challenge_id : id; // 저장 후·취소 시 돌아갈 챌린지

  async function handleSubmit(input: FeedInput) {
    const path = isEdit ? `/feed/${feedId}` : `/feed`;
    const method = isEdit ? "PATCH" : "POST";
    const form = new FormData();
    if(!isEdit){
      if (!id) throw new Error("챌린지 정보를 찾을 수 없습니다.");
      form.append("challenge_id", id);
    }
    form.append("title", input.title);
    form.append("content", input.content);
    input.images.forEach((image) => {
      form.append("images", image);
    });
    await apiFetch<Feed>(path, { method, token, body: form});
    navigate(`/challenges/${challengeId}?tab=feed`, {replace: true});
  }

  if (isEdit && loading) return <p>불러오는 중...</p>;
  if (isEdit && error) return <p>{error}</p>;
  if (isEdit && !feed) return <p>존재하지 않는 피드입니다.</p>;

  return (
    <div>
      <Link to={challengeId ? `/challenges/${challengeId}?tab=feed` : "/challenges"}>← 취소</Link>
      <h1>{isEdit ? "피드 수정" : "피드 작성"}</h1>
      <FeedForm
        key={feedId ?? "new"}
        initialValues={feed ? { title: feed.title, content: feed.content, images: feed.images ?? [] } : undefined}
        submitLabel={isEdit ? "수정" : "작성"}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default FeedFormPage;
