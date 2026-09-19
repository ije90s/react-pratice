import { Link } from "react-router-dom";
import MyProfileSection from "../components/MyProfileSection";
import MyParticipationSection from "../components/MyParticipationSection";

function MyPage() {
  return (
    <div>
      <Link to="/challenges">← 챌린지 목록</Link>
      <h1>마이페이지</h1>
      <MyProfileSection />
      <MyParticipationSection />
    </div>
  );
}

export default MyPage;
