// previous editing: import { Link, NavLink, useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import {
  ChevronLeft,
  LogOut,
  MessageSquare,
  BookOpen,
  User,
  Shield,
  Trophy,
  Bell,
  BarChart3,
  FileText,
  Terminal,
} from "lucide-react";
function StudentSidebar() {
  const navItems = [
    { label: "Contest", to: "/student/contest", icon: Trophy },
    { label: "Discussion", to: "/student/discussion", icon: MessageSquare },
    { label: "Problem Bank", to: "/student/problems", icon: BookOpen },
    { label: "Profile", to: "/student/profile", icon: User },
  ];
  return (
    <>
      <aside className="flex h-full w-65 shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-[#0c1729] text-white">
        <div className="border-b border-slate-800 px-5 py-5">
          <Link to="/" className="flex items-center gap-2 text-xl font-black">
            <span>
              <Terminal />
            </span>
            <span>QuickJudge</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => {
                  return `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${
                    isActive
                      ? "bg-slate-700/40 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`;
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-800 px-3 py-4">
          <div className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sky-400 transition hover:hover:bg-slate-800"
            >
              <ChevronLeft size={18} />
              <span>Collapse</span>
            </button>

            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sky-400 transition hover:bg-slate-800"
            >
              <Shield size={18} />
              <span>Switch to Admin</span>
            </Link>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sky-400 transition hover:hover:bg-slate-800"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default StudentSidebar;
