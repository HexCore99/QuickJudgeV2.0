import { CalendarDays, Clock3, History, Layers3 } from "lucide-react";

const iconMap = {
  all: Layers3,
  live: Clock3,
  upcoming: CalendarDays,
  past: History,
};

function ContestFilterBar({
  filters,
  activeFilter,
  setActiveFilter,
  setPastFilter,
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {filters.map(({ key, label }) => {
        const Icon = iconMap[key];

        return (
          <button
            key={key}
            onClick={() => {
              setActiveFilter(key);
              if (key !== "past") setPastFilter("all");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
              activeFilter === key
                ? "border-amber-200 bg-amber-50/80 text-amber-700 shadow-sm"
                : "border-transparent bg-transparent text-slate-500 hover:bg-white/70 hover:text-slate-800"
            }`}
          >
            {key === "live" ? (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="h-2 w-2 rounded-full bg-slate-400" />
              </div>
            ) : (
              <Icon className="h-3.5 w-3.5" />
            )}

            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ContestFilterBar;
