import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import ProfileDropdown from "../common/ProfileDropdown";

const defaultTabs = [
  { key: "Problems", to: "/student/problems" },
  { key: "Contests", to: "/student/contests" },
  { key: "Leaderboard", to: "/student/leaderboard" },
  { key: "Discuss", to: "/student/discuss" },
];

function StudentTopTabs({
  tabs = defaultTabs,
  logoTo = "/",
  extraActions = null,
  navExtra = null,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderTabLinks = (variant = "desktop") =>
    tabs.map((tab) => (
      <NavLink
        key={tab.key}
        to={tab.to}
        end={tab.end}
        onClick={() => {
          if (variant === "mobile") {
            setIsMobileMenuOpen(false);
          }
        }}
        className={({ isActive }) =>
          `inline-flex shrink-0 items-center rounded-full px-4 py-2 text-[14px] font-medium tracking-tight transition ${
            variant === "mobile" ? "w-full justify-start" : "justify-center"
          } ${
            isActive
              ? "bg-amber-50 text-amber-700 shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`
        }
      >
        {tab.key}
      </NavLink>
    ));

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
          {renderTabLinks()}
          {navExtra}
        </nav>

        <div className="flex items-center gap-3">
          {extraActions}
          <div className="relative md:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              aria-label={
                isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
              aria-haspopup="menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <nav className="flex flex-col gap-1">
                  {renderTabLinks("mobile")}
                  {navExtra ? (
                    <div className="border-t border-slate-100 pt-2">
                      {navExtra}
                    </div>
                  ) : null}
                </nav>
              </div>
            )}
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

export default StudentTopTabs;
