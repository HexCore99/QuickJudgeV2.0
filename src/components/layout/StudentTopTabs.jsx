import { Link } from "react-router-dom";
import { Bell, Zap } from "lucide-react";

const defaultTabs = [
  { key: "Problems", href: "#" },
  { key: "Contests", href: "#" },
  { key: "Leaderboard", href: "#" },
  { key: "Discuss", href: "#" },
];

function StudentTopTabs({
  activeTab = "Contests",
  tabs = defaultTabs,
  logoTo = "/",
}) {
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

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <a
                key={tab.key}
                href={tab.href}
                className={`relative pb-3 text-[14px] font-medium tracking-tight transition ${
                  isActive
                    ? "text-amber-700"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.key}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-amber-600" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 transition hover:text-slate-700">
            <Bell className="h-4 w-4" />
          </button>

          <div className="h-10 w-10 rounded-full border-2 border-amber-500 bg-[radial-gradient(circle_at_35%_30%,#d6d3d1,#78716c_45%,#1f2937_100%)]" />
        </div>
      </div>
    </header>
  );
}

export default StudentTopTabs;
