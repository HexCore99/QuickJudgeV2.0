import { Outlet, Navigate } from "react-router-dom";

function getStoredUser() {
  const token = localStorage.getItem("qj_token");
  const userString = localStorage.getItem("qj_user");

  if (!token || !userString) {
    localStorage.removeItem("qj_token");
    localStorage.removeItem("qj_user");
    return null;
  }

  try {
    return JSON.parse(userString);
  } catch {
    localStorage.removeItem("qj_token");
    localStorage.removeItem("qj_user");
    return null;
  }
}

function AdminLayout() {
  const user = getStoredUser();
  const canAccessAdmin = ["admin", "super_admin"].includes(user?.role);

  if (!user) return <Navigate to="/login" replace />;
  if (!canAccessAdmin) return <Navigate to="/student/contests" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  );
}

export default AdminLayout;
