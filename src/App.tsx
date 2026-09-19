import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import ChallengeListPage from "./pages/ChallengeListPage";
import ChallengeFormPage from "./pages/ChallengeFormPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import FeedFormPage from "./pages/FeedFormPage";
import FeedDetailPage from "./pages/FeedDetailPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<AppLayout />}>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/challenges" element={<ChallengeListPage />} />
          <Route path="/challenges/new" element={<ChallengeFormPage />} />
          <Route path="/challenges/:id/edit" element={<ChallengeFormPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
          <Route path="/challenges/:id/feeds/new" element={<FeedFormPage />} />
          <Route path="/feeds/:feedId" element={<FeedDetailPage />} />
          <Route path="/feeds/:feedId/edit" element={<FeedFormPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
