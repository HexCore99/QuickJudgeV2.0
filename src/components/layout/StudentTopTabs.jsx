import { Link, NavLink } from "react-router-dom";
import { Bell, Zap } from "lucide-react";
import ProfileDropdown from "../common/ProfileDropdown";

const defaultTabs = [
  { key: "Problems", to: "/student/problems" },
  { key: "Contests", to: "/student/contests" },
  { key: "Leaderboard", to: "/student/leaderboard" },
  { key: "Discuss", to: "/student/discuss" },
];

function StudentTopTabs({ tabs = defaultTabs, logoTo = "/", extraActions = null, navExtra = null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e8e4dd] bg-white">
      <div className="h-2 w-full bg-[#e8d3bc]" />

      <div className="relative flex w-full items-center justify-between px-6 py-3.5 lg:px-8">
        <Link
          to={logoTo}
          className="flex items-center gap-3 rounded-xl transition hover:opacity-90"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
            <Zap className="h-4.5 w-4.5" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-tight text-slate-800">
              QuickJudge
            </span>
            <span className="text-[13px] text-slate-400">V2.0</span>
          </div>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
          {tabs.map((tab) => (
            <NavLink
              key={tab.key}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-medium tracking-tight transition ${
                  isActive
                    ? "bg-amber-50 text-amber-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`
              }
            >
              {tab.key}
            </NavLink>
          ))}
          {navExtra}
        </nav>

        <div className="flex items-center gap-3">
          {extraActions}
          <button className="text-slate-400 transition hover:text-slate-700">
            <Bell className="h-4 w-4" />
          </button>

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

export default StudentTopTabs;
