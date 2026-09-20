import { Link, useParams, useSearchParams } from "react-router-dom";
import ChallengeFeedTab from "../components/ChallengeFeedTab";
import ChallengeRankTab from "../components/ChallengeRankTab";
import useFetch from "../hooks/useFetch";
import type { Challenge } from "../types/challenge";

type Tab = "detail" | "rank" | "feed";

function ChallengeDetailPage() {
  const { id } = useParams(); // URL의 :id — 항상 string | undefined
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get("tab");
  const tab: Tab =
    value === "detail" || value === "rank" || value === "feed"
      ? value
      : "detail";

  function setTab(next: Tab){
    setSearchParams({ tab: next });
  }
  // 백엔드는 없는 id에도 404가 아니라 200 + data: null 로 응답하므로 T에 null을 포함한다
  const { data: challenge, loading, error } = useFetch<Challenge | null>(
    id ? `/challenge/${id}` : null,
  );

  if (!id) return <p>잘못된 접근입니다.</p>;
  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!challenge) return <p>존재하지 않는 챌린지입니다.</p>;

  return (
    <div>
      <Link to="/challenges">← 목록</Link>
      <h1>{challenge.title}</h1>

      <nav>
        <button onClick={() => setTab("detail")} disabled={tab === "detail"}>
          상세
        </button>
        <button onClick={() => setTab("rank")} disabled={tab === "rank"}>
          랭킹
        </button>
        <button onClick={() => setTab("feed")} disabled={tab === "feed"}>
          피드
        </button>
      </nav>

      {tab === "detail" && (
        <section>
          <p>{challenge.content}</p>
          <dl>
            <dt>기간</dt>
            <dd>
              {challenge.start_date.slice(0, 10)} ~{" "}
              {challenge.end_date.slice(0, 10)}
            </dd>
            <dt>유형</dt>
            <dd>{challenge.type}</dd>
            <dt>최소 횟수</dt>
            <dd>{challenge.mininum_count}</dd>
          </dl>
        </section>
      )}
      {tab === "rank" && (
        <ChallengeRankTab challengeId={challenge.id} type={challenge.type} />
      )}
      {tab === "feed" && <ChallengeFeedTab challengeId={challenge.id} />}
    </div>
  );
}

export default ChallengeDetailPage;
