import { createElement } from "react";
import {
  Bell,
  BarChart3,
  FileText,
  HelpCircle,
  Send,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

const ADMIN_CONTEST_TABS = [
  { label: "Problems", key: "problems", icon: FileText },
  { label: "Submissions", key: "submissions", icon: Send },
  { label: "Leaderboard", key: "leaderboard", icon: BarChart3 },
  { label: "Announcements", key: "announcements", icon: Bell },
  { label: "Queries", key: "queries", icon: HelpCircle },
];

function AdminContestTabs() {
  const { contestId } = useParams();

  return (
    <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-slate-200/60 p-2 text-sm">
      {ADMIN_CONTEST_TABS.map(({ label, key, icon }) => (
        <NavLink
          key={key}
          to={`/admin/contests/${contestId}/${key}`}
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-lg px-4 py-2 transition ${
              isActive
                ? "bg-white font-semibold text-slate-900 shadow-sm"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
            }`
          }
        >
          {createElement(icon, { size: 16 })}
          {label}
        </NavLink>
      ))}
    </div>
  );
}

export default AdminContestTabs;
