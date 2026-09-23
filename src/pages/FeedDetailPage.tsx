import { Link, useParams } from "react-router-dom";
import FeedOwnerActions from "../components/FeedOwnerActions";
import useFetch from "../hooks/useFetch";
import type { Feed } from "../types/feed";

function FeedDetailPage() {
  const { feedId } = useParams();
  // 챌린지 상세와 같은 이유로 T에 null을 포함한다(없는 id에 200 + data: null)
  const { data: feed, loading, error } = useFetch<Feed | null>(
    feedId ? `/feed/${feedId}` : null,
  );

  if (!feedId) return <p>잘못된 접근입니다.</p>;
  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!feed) return <p>존재하지 않는 피드입니다.</p>;

  // 챌린지가 삭제된 피드면 challenge_id가 null이라 돌아갈 피드 탭이 없다
  const backTo = feed.challenge_id !== null ? `/challenges/${feed.challenge_id}?tab=feed` : "/challenges";

  return (
    <div>
      <Link to={backTo}>← 피드 목록</Link>
      <h1>{feed.title}</h1>
      <FeedOwnerActions feedId={feed.id} authorId={feed.user_id} challengeId={feed.challenge_id} />
      <p>{feed.content}</p>
      {/* 이미지 표시는 보완 과제 — 지금은 목록과 같이 장수만 */}
      {feed.images && feed.images.length > 0 && <small>사진 {feed.images.length}장</small>}
    </div>
  );
}

export default FeedDetailPage;
