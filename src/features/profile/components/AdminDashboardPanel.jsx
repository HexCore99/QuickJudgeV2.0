import { Link } from "react-router-dom";
import { Trophy, FileText, Zap, CalendarDays, ChevronRight, Clock, Users, CheckCircle2, AlertCircle } from "lucide-react";

// Mocks
const STATS = [
  { label: "Total Contests",  value: 12, delta: "+2 this month", Icon: Trophy,       accent: "amber"   },
  { label: "Total Problems",  value: 48, delta: "+5 this month", Icon: FileText,     accent: "blue"    },
  { label: "Active Contests", value: 3,  delta: "Running now",   Icon: Zap,          accent: "emerald" },
  { label: "Upcoming",        value: 2,  delta: "Next 7 days",   Icon: CalendarDays, accent: "violet"  },
];

const CONTESTS = [
  { id: 1, title: "Weekly Algo Sprint #14",    status: "Running",  participants: 142, problems: 5, time: "2h 34m left",   date: "Apr 17, 2026" },
  { id: 2, title: "Graph Theory Beginner Cup", status: "Running",  participants: 89,  problems: 4, time: "5h 12m left",   date: "Apr 17, 2026" },
];

const PROBLEMS = [
  { id: 1, title: "Two Sum Variants",         difficulty: "Easy",   tag: "Array",         hasEditorial: true },
  { id: 2, title: "Shortest Path in Grid",    difficulty: "Medium", tag: "Graph",         hasEditorial: false },
];

const statusStyles = {
  Running:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Upcoming: "bg-blue-50   text-blue-700   border-blue-200",
};

const diffStyles = {
  Easy:   "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50   text-amber-700",
  Hard:   "bg-red-50     text-red-600",
};

const accentMap = {
  amber: { card: "border-amber-200/80 bg-amber-50/40 hover:bg-amber-50/60 hover:border-amber-300", icon: "bg-amber-100 text-amber-600", val: "text-amber-700", delta: "text-amber-700 bg-amber-50" },
  blue: { card: "border-blue-200/80 bg-blue-50/40 hover:bg-blue-50/60 hover:border-blue-300", icon: "bg-blue-100 text-blue-600", val: "text-blue-700", delta: "text-blue-700 bg-blue-50" },
  emerald: { card: "border-emerald-200/80 bg-emerald-50/40 hover:bg-emerald-50/60 hover:border-emerald-300", icon: "bg-emerald-100 text-emerald-600", val: "text-emerald-700", delta: "text-emerald-700 bg-emerald-50" },
  violet: { card: "border-violet-200/80 bg-violet-50/40 hover:bg-violet-50/60 hover:border-violet-300", icon: "bg-violet-100 text-violet-600", val: "text-violet-700", delta: "text-violet-700 bg-violet-50" },
};

function StatCard({ stat }) {
  const a = accentMap[stat.accent];
  return (
    <div className={`rounded-2xl border p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm ${a.card}`}>
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${a.icon}`}>
        <stat.Icon className="h-4 w-4" />
      </div>
      <div className={`text-3xl font-bold tracking-tight ${a.val}`}>{stat.value}</div>
      <div className="mt-0.5 text-[13px] font-medium text-slate-500">{stat.label}</div>
      <div className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${a.delta}`}>
        {stat.delta}
      </div>
    </div>
  );
}

function ContestCard({ contest }) {
  return (
    <div className="block group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-slate-800 group-hover:text-amber-700 transition-colors">{contest.title}</h3>
          <p className="mt-0.5 text-[12px] text-slate-400">{contest.date}</p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[contest.status]}`}>
          {contest.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-slate-400" /> {contest.participants}</span>
          <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-slate-400" /> {contest.problems} probs</span>
        </div>
        <span className="flex items-center gap-1.5 font-medium text-slate-600"><Clock className="h-3.5 w-3.5 text-amber-500" /> {contest.time}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPanel() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] font-bold text-slate-800">Active & Upcoming Contests</h2>
          </div>
          <div className="space-y-3">
            {CONTESTS.map((c) => (
              <ContestCard key={c.id} contest={c} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] font-bold text-slate-800">Recent Problems</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              {PROBLEMS.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0 hover:bg-slate-50/50 transition px-2 rounded-lg -mx-2">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800">{p.title}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diffStyles[p.difficulty]}`}>
                        {p.difficulty}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{p.tag}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {p.hasEditorial ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Editorial</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400"><AlertCircle className="h-3.5 w-3.5" /> No Editorial</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
