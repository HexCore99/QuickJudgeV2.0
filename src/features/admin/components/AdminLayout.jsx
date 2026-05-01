import { Outlet, Navigate, useLocation } from "react-router-dom";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { ADMIN_NAV_TABS } from "../AdminNavTabs";
import AdminMoreMenu from "./AdminMoreMenu";

function AdminLayout() {
  const location = useLocation();
  const userString = localStorage.getItem("qj_user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/student/contests" replace />;

  const isCreateProblemPage = location.pathname === "/admin/create_problem";
  const isCreateContestPage = location.pathname === "/admin/create_contest";
  const isCreateActionPage = isCreateProblemPage || isCreateContestPage;
  const adminTabs = ADMIN_NAV_TABS.map((tab) => ({
    ...tab,
    end: isCreateActionPage ? true : tab.end,
  }));
  const excludeAction = isCreateProblemPage
    ? "problem"
    : isCreateContestPage
      ? "contest"
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentTopTabs
        tabs={adminTabs}
        logoTo="/"
        navExtra={<AdminMoreMenu excludeAction={excludeAction} />}
      />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
