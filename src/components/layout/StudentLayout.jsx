import { Outlet, Navigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

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

function StudentLayout() {
  const user = getStoredUser();

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
