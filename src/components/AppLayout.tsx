import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppLayout() {
  const { token, logout } = useAuth();

  if(!token){
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <header>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <NavLink
            to="/challenges"
            style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}
          >
            챌린지
          </NavLink>
          <NavLink
            to="/mypage"
            style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}
          >
            마이페이지
          </NavLink>
          <button onClick={logout} style={{ marginLeft: "auto" }}>
            로그아웃
          </button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
