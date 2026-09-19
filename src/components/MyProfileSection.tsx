import useFetch from "../hooks/useFetch";
import type { User } from "../types/user";

function MyProfileSection() {
  const { data: user, loading, error } = useFetch<User>("/user/me");

  return (
    <section>
      <h2>내 정보</h2>
      {loading && <p>불러오는 중...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && user && <p>{user.email}</p>}
    </section>
  );
}

export default MyProfileSection;
