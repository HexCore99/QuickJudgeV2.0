import { Navigate, createBrowserRouter } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import StudentLayout from "../components/layout/StudentLayout";
import ContestAnnouncements from "../features/contests/components/contestDetails/ContestAnnouncements";
import ContestLayoutPage from "../pages/student//ContestLayoutPage";
import ContestLeaderboardPage from "../features/contests/components/contestDetails/ContestLeaderboard";
import ContestPage from "../pages/student/ContestPage";
import ContestQueriesPage from "../features/contests/components/contestDetails/ContestQueries";
import ContestSubmissionsPage from "../features/contests/components/contestDetails/ContestSubmissions";
import PastContestsPage from "../features/contests/PastContestsPage";
import ProfilePage from "../pages/student/ProfilePage";
import ContestProblemsTable from "../features/contests/components/contestDetails/ContestProblemsTable";
import ContestProblems from "../features/contests/components/contestDetails/ContestProblems";
import GlobalLeaderboardPage from "../pages/student/leaderboard/GlobalLeaderboardPage";

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
      { path: "profile", element: <ProfilePage /> },
      { path: "contests", element: <ContestPage /> },
      { path: "contests/past", element: <PastContestsPage /> },
      { path: "leaderboard", element: <GlobalLeaderboardPage /> },
      {
        path: ":contestId",
        element: <ContestLayoutPage />,
        children: [
          { index: true, element: <Navigate to="problems" replace /> },
          { path: "problems", element: <ContestProblems /> },
          { path: "submissions", element: <ContestSubmissionsPage /> },
          { path: "leaderboard", element: <ContestLeaderboardPage /> },
          { path: "announcements", element: <ContestAnnouncements /> },
          { path: "queries", element: <ContestQueriesPage /> },
        ],
      },
    ],
  },
]);

export default router;
