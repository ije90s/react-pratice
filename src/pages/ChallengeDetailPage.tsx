import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import ChallengeRankTab from "../components/ChallengeRankTab";
import type { Challenge } from "../types/challenge";

type Tab = "detail" | "rank" | "feed";

function ChallengeDetailPage() {
  const { id } = useParams(); // URL의 :id — 항상 string | undefined
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>("detail");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchChallenge(){
      try{
        setLoading(true);
        setError("");
        if (typeof id !== "string" || id.trim() === "") {
          setError("잘못된 접근입니다.");
          return;
        }
        const response = await apiFetch<Challenge | null>(`/challenge/${id}`, { token });
        if (cancelled) return;
        
        if (!response) {
          setError("존재하지 않는 챌린지입니다.");
          return;
        }
        setChallenge(response);
      }catch(err){
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "알 수 없는 에러가 발생했습니다.");
      }finally{
        if(!cancelled) setLoading(false);
      }
    }
    fetchChallenge();
    return () => { cancelled = true; };
  }, [id, token]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!challenge) return null;

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
      {tab === "feed" && <p>피드 (다음 단계)</p>}
    </div>
  );
}

export default ChallengeDetailPage;
