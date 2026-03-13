import { createBrowserRouter, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import StudentLayout from "../components/layout/StudentLayout";
import ContestPage from "../pages/student/ContestPage";

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
    children: [{ index: true, element: <ContestPage /> }],
  },
]);

export default router;
