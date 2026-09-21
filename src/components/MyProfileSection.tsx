import { useMe } from "../context/UserContext";

// 내 정보는 UserProvider가 한 번만 조회해서 공유한다 — 여기서 다시 요청하지 않는다.
function MyProfileSection() {
  const { me, loading, error } = useMe();

  return (
    <section>
      <h2>내 정보</h2>
      {loading && <p>불러오는 중...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && me && <p>{me.email}</p>}
    </section>
  );
}

export default MyProfileSection;
