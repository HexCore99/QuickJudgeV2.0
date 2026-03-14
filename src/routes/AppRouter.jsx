import { createBrowserRouter, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import StudentLayout from "../components/layout/StudentLayout";
import ContestPage from "../pages/student/ContestPage";
import ContestDetailsPage from "../pages/student/ContestDetailsPage";

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
      { path: "contest", element: <ContestPage /> },
      { path: "contest/:contestId", element: <ContestDetailsPage /> },
      // { path: "contst/:contestId", element: <ContestDetailsPage /> },
    ],
  },
]);

export default router;
