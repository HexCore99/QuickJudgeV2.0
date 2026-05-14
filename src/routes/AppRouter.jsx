import { Navigate, createBrowserRouter } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";
import PublicOnlyRoute from "./PublicOnlyRoute";
import StudentLayout from "../components/layout/StudentLayout";
import ContestAnnouncements from "../features/contests/components/contestDetails/ContestAnnouncements";
import ContestLayoutPage from "../pages/student/contests/ContestLayoutPage";
import ContestLeaderboardPage from "../features/contests/components/contestDetails/ContestLeaderboard";
import ContestPage from "../pages/student/contests/ContestPage";
import ContestQueriesPage from "../features/contests/components/contestDetails/ContestQueries";
import ContestSubmissionsPage from "../features/contests/components/contestDetails/ContestSubmissions";
import PastContestsPage from "../features/contests/PastContestsPage";
import ProfilePage from "../pages/student/Profile/ProfilePage";
import ContestProblems from "../features/contests/components/contestDetails/ContestProblems";
import GlobalLeaderboardPage from "../pages/student/leaderboard/GlobalLeaderboardPage";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminLayout from "../features/admin/components/AdminLayout";
import CreateProblemPage from "../pages/admin/problems/CreateProblemPage";
import CreateContestPage from "../pages/admin/contests/CreateContestPage";
import DiscussionPage from "../pages/student/discussions/DiscussionPage";
import EditorialsPage from "../pages/admin/editorials/EditorialPage";
import ProblemPage from "../pages/student/problems/ProblemPage";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicOnlyRoute>
        <SignupPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <PublicOnlyRoute>
        <ResetPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { path: "profile", element: <ProfilePage /> },
      { path: "contests", element: <ContestPage /> },
      { path: "contests/past", element: <PastContestsPage /> },
      { path: "leaderboard", element: <GlobalLeaderboardPage /> },
      { path: "discussion", element: <DiscussionPage /> },
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
  {
    path: "/student/:contestId/problems/:problemId",
    element: <ProblemPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "create_problem", element: <CreateProblemPage /> },
      { path: "create_contest", element: <CreateContestPage /> },
      { path: "editorials", element: <EditorialsPage /> },

    ],
  },
]);

export default router;
