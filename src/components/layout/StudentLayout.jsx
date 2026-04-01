import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

function StudentLayout() {
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
