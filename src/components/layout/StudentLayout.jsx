import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

function StudentLayout() {
  return (
    <div className="flex max-h-screen bg-slate-100">
      <StudentSidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
