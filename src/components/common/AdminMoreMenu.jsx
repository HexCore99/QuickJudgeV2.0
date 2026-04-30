import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Trophy, Code2 } from "lucide-react";

const ACTION_ITEMS = [
  {
    key: "contest",
    label: "Create Contest",
    to: "/admin/contests/create",
    Icon: Trophy,
    hoverClasses: "hover:bg-amber-50 hover:text-amber-700",
  },
  {
    key: "problem",
    label: "Create Problem",
    to: "/admin/problems/create",
    Icon: Code2,
    hoverClasses: "hover:bg-blue-50 hover:text-blue-700",
  },
];

export default function AdminMoreMenu({ excludeAction = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const menuItems = ACTION_ITEMS.filter((item) => item.key !== excludeAction);
  const triggerLabel =
    excludeAction === "contest"
      ? "Create Contest"
      : excludeAction === "problem"
        ? "Create Problem"
        : "More";
  const isCurrentAction = excludeAction !== null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium tracking-tight transition ${
          isOpen || isCurrentAction
            ? "bg-amber-50 text-amber-700 shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        {triggerLabel}{" "}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && menuItems.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <div className="mb-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </div>
          <div className="flex flex-col">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 transition ${item.hoverClasses}`}
              >
                <item.Icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
