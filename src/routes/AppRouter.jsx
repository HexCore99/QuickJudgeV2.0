import { Navigate, createBrowserRouter } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import StudentLayout from "../components/layout/StudentLayout";
import ContestPage from "../pages/student/ContestPage";
import ContestDetailsPage from "../pages/student/ContestDetailsPage";
import PastContestsPage from "../pages/student/PastContestsPage";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { path: "contests", element: <ContestPage /> },
      { path: "contests/past", element: <PastContestsPage /> },

      { path: ":contestId", element: <Navigate to="problems" replace /> },
      { path: ":contestId/problems", element: <ContestDetailsPage /> },
      { path: ":contestId/submissions", element: <ContestDetailsPage /> },
      { path: ":contestId/leaderboard", element: <ContestDetailsPage /> },
      { path: ":contestId/announcements", element: <ContestDetailsPage /> },
      { path: ":contestId/queries", element: <ContestDetailsPage /> },
    ],
  },
]);

export default router;
