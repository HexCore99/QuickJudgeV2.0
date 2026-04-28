import { BarChart3, Code, Activity, Flag } from "lucide-react";

const tabs = [
  { id: "overview", icon: BarChart3, label: "Overview" },
  { id: "submissions", icon: Code, label: "Submissions" },
  { id: "activity", icon: Activity, label: "Activity" },
  { id: "contests", icon: Flag, label: "Contests", badge: null },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
  contestCount,
}) {

  return (
    <div className="mb-6 overflow-x-auto pb-1">
      <div className="flex gap-1 rounded-[14px] border border-black/7 bg-slate-100 p-1 w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge =
            tab.id === "contests" && contestCount ? contestCount : tab.badge;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-[11px] border px-5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "border-amber-600/20 bg-amber-600/7 text-amber-600"
                  : "border-transparent bg-transparent text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"
              }`}
            >
              <Icon className="h-3.25 w-3.25" />
              <span className="hidden sm:inline">{tab.label}</span>
              {badge && (
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] ${
                    isActive ? "bg-amber-600/15" : "bg-slate-200"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
