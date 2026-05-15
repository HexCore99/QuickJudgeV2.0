import { Navigate } from "react-router-dom";

function getAuthenticatedHome() {
  const token = localStorage.getItem("qj_token");
  const userString = localStorage.getItem("qj_user");

  if (!token || !userString) {
    return null;
  }

  try {
    const role = JSON.parse(userString)?.role;

    if (["admin", "super_admin"].includes(role)) {
      return "/admin/dashboard";
    }

    if (role === "student") {
      return "/student/contests";
    }
  } catch {
    return null;
  }

  return null;
}

export default function PublicOnlyRoute({ children }) {
  const authenticatedHome = getAuthenticatedHome();

  if (authenticatedHome) {
    return <Navigate to={authenticatedHome} replace />;
  }

  return children;
}
