import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

function StudentLayout() {
  return (
    <>
      <div className="flex h-screen overflow-hidden bg-slate-100">
        <StudentSidebar />
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default StudentLayout;
