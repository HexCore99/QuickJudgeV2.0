import { Outlet, Navigate } from "react-router-dom";

function AdminLayout() {
  const userString = localStorage.getItem("qj_user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/student/contests" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  );
}

export default AdminLayout;
