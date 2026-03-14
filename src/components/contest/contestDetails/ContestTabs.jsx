import { Bell, BarChart3, FileText, HelpCircle, Send } from "lucide-react";

const tabConfig = [
  { label: "Problems", icon: FileText, active: true },
  { label: "Submissions", icon: Send, active: false },
  { label: "Leaderboard", icon: BarChart3, active: false },
  { label: "Announcements", icon: Bell, active: false },
  { label: "Queries", icon: HelpCircle, active: false },
];

function ContestTabs() {
  return (
    <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-slate-200/60 p-2 text-sm">
      {tabConfig.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            type="button"
            key={tab.label}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
              tab.active
                ? "bg-white font-semibold text-slate-900"
                : "text-slate-500"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default ContestTabs;
