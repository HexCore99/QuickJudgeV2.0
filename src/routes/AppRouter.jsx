import { Navigate, createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminContestsPage from "../pages/admin/contests/AdminContestsPage";
import AdminContestAnnouncementsPage from "../features/admin/components/AdminContestAnnouncementsPage";
import AdminContestLayoutPage from "../pages/admin/contests/AdminContestLayoutPage";
import AdminContestProblemsPage from "../features/admin/components/AdminContestProblemsPage";
import AdminContestQueriesPage from "../features/admin/components/AdminContestQueriesPage";
import AdminContestSubmissionsPage from "../features/admin/components/AdminContestSubmissionsPage";
import CreateContestPage from "../pages/admin/contests/CreateContestPage";
import ProblemBankPage from "../pages/admin/problems/ProblemBankPage";
import CreateProblemPage from "../pages/admin/problems/CreateProblemPage";
import EditorialsPage from "../pages/admin/editorials/EditorialsPage";
import AdminAuditLogsPage from "../pages/admin/auditLogs/AdminAuditLogsPage";
import AdminUsersPage from "../pages/admin/users/AdminUsersPage";
import AdminSettingsPage from "../pages/admin/settings/AdminSettingsPage";
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";
import PublicOnlyRoute from "./PublicOnlyRoute";
import StudentLayout from "../components/layout/StudentLayout";
import ContestAnnouncementsPage from "../features/contests/components/contestDetails/ContestAnnouncementsPage";
import ContestLayoutPage from "../pages/student/contests/ContestLayoutPage";
import ContestLeaderboardPage from "../features/contests/components/contestDetails/ContestLeaderboardPage";
import ContestPage from "../pages/student/contests/ContestPage";
import ContestProblemsPage from "../features/contests/components/contestDetails/ContestProblemsPage";
import ContestQueriesPage from "../features/contests/components/contestDetails/ContestQueriesPage";
import ContestSubmissionsPage from "../features/contests/components/contestDetails/ContestSubmissionsPage";
import PastContestsPage from "../pages/student/contests/PastContestsPage";
import GlobalLeaderboardPage from "../pages/student/leaderboard/GlobalLeaderboardPage";
import ProblemPage from "../pages/student/problems/ProblemPage";
import StudentProblemBankPage from "../pages/student/problems/StudentProblemBankPage";
import ProfilePage from "../pages/student/profile/ProfilePage";
import DiscussionPage from "../pages/student/discussions/DiscussionPage";

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
      { path: "problems", element: <StudentProblemBankPage /> },
      { path: "discuss", element: <DiscussionPage /> },
      { path: "problems/:problemId", element: <ProblemPage /> },
      {
        path: "contests/:contestId/problems/:problemId",
        element: <ProblemPage />,
      },
      {
        path: "contests/:contestId",
        element: <ContestLayoutPage />,
        children: [
          { index: true, element: <Navigate to="problems" replace /> },
          { path: "problems", element: <ContestProblemsPage /> },
          { path: "submissions", element: <ContestSubmissionsPage /> },
          { path: "leaderboard", element: <ContestLeaderboardPage /> },
          { path: "announcements", element: <ContestAnnouncementsPage /> },
          { path: "queries", element: <ContestQueriesPage /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "contests", element: <AdminContestsPage /> },
      { path: "contests/create", element: <CreateContestPage /> },
      { path: "contests/:contestId/edit", element: <CreateContestPage /> },
      {
        path: "contests/:contestId/problems/:problemId",
        element: <ProblemPage />,
      },
      {
        path: "contests/:contestId",
        element: <AdminContestLayoutPage />,
        children: [
          { index: true, element: <Navigate to="problems" replace /> },
          { path: "problems", element: <AdminContestProblemsPage /> },
          { path: "submissions", element: <AdminContestSubmissionsPage /> },
          { path: "leaderboard", element: <ContestLeaderboardPage /> },
          { path: "announcements", element: <AdminContestAnnouncementsPage /> },
          { path: "logs", element: <Navigate to="../problems" replace /> },
          { path: "queries", element: <AdminContestQueriesPage /> },
        ],
      },
      { path: "problems", element: <ProblemBankPage /> },
      { path: "problems/create", element: <CreateProblemPage /> },
      { path: "problems/:problemId", element: <ProblemPage /> },
      { path: "problems/:problemId/edit", element: <CreateProblemPage /> },
      { path: "editorials", element: <EditorialsPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "logs", element: <AdminAuditLogsPage /> },
      { path: "settings", element: <AdminSettingsPage /> },
    ],
  },
]);

export default router;
