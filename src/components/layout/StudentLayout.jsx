import { Outlet, Navigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

function StudentLayout() {
  const userString = localStorage.getItem("qj_user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "student") return <Navigate to="/admin/dashboard" replace />;

  return (
    <>
      <div className="flex overflow-hidden bg-slate-100">
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default StudentLayout;
