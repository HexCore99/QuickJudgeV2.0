import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import {
  selectAdminDashboardContests,
  selectAdminDashboardError,
  selectAdminDashboardLoading,
  selectAdminDashboardProblems,
  selectAdminDashboardStats,
} from "../../../features/admin/adminDashboardSelectors";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import { fetchAdminDashboard } from "../../../features/admin/adminDashboardThunks";

const statIconMap = {
  totalContests: Trophy,
  totalProblems: FileText,
  activeContests: Zap,
  upcomingContests: CalendarDays,
};

const statusStyles = {
  Running: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
};

const diffStyles = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-600",
};

const accentMap = {
  amber: {
    card: "border-amber-200/80 bg-amber-50/40 hover:bg-amber-50/60 hover:border-amber-300",
    icon: "bg-amber-100 text-amber-600",
    val: "text-amber-700",
  },
  blue: {
    card: "border-blue-200/80 bg-blue-50/40 hover:bg-blue-50/60 hover:border-blue-300",
    icon: "bg-blue-100 text-blue-600",
    val: "text-blue-700",
  },
  emerald: {
    card: "border-emerald-200/80 bg-emerald-50/40 hover:bg-emerald-50/60 hover:border-emerald-300",
    icon: "bg-emerald-100 text-emerald-600",
    val: "text-emerald-700",
  },
  violet: {
    card: "border-violet-200/80 bg-violet-50/40 hover:bg-violet-50/60 hover:border-violet-300",
    icon: "bg-violet-100 text-violet-600",
    val: "text-violet-700",
  },
};

function StatCard({ stat }) {
  const accent = accentMap[stat.accent] || accentMap.amber;
  const Icon = statIconMap[stat.key] || Trophy;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${accent.card}`}
    >
      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent.icon}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className={`text-3xl font-bold tracking-tight ${accent.val}`}>
        {stat.value}
      </div>
      <div className="mt-0.5 text-[13px] font-medium text-slate-500">
        {stat.label}
      </div>
    </div>
  );
}

function ContestCard({ contest }) {
  return (
    <div className="group block rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-bold text-slate-800 transition-colors group-hover:text-amber-700">
            {contest.title}
          </h3>
          <p className="mt-0.5 text-[12px] text-slate-400">{contest.date}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[contest.status]}`}
        >
          {contest.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            {contest.participants}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            {contest.problems} probs
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          {contest.time}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-8 text-center text-[13px] font-medium text-slate-400">
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectAdminDashboardStats);
  const contests = useSelector(selectAdminDashboardContests);
  const problems = useSelector(selectAdminDashboardProblems);
  const isLoading = useSelector(selectAdminDashboardLoading);
  const error = useSelector(selectAdminDashboardError);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={getCurrentAdminNavTabs()}
          logoTo="/"
          navExtra={<AdminMoreMenu />}
        />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Overview of your platform's activity and quick actions.
            </p>
          </div>

          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.key || stat.label} stat={stat} />
              ))}
              {isLoading && !stats.length ? (
                <EmptyState>Loading dashboard totals...</EmptyState>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-slate-800">
                    Active & Upcoming Contests
                  </h2>
                </div>
                <div className="space-y-3">
                  {contests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                  ))}
                  {!isLoading && !contests.length ? (
                    <EmptyState>No active or upcoming contests yet.</EmptyState>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4 lg:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-slate-800">
                    Recent Problems
                  </h2>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-1">
                    {problems.map((problem) => (
                      <div
                        key={problem.id}
                        className="-mx-2 flex items-center justify-between rounded-lg border-b border-slate-100 px-2 py-3 transition last:border-0 hover:bg-slate-50/50"
                      >
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800">
                            {problem.title}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${diffStyles[problem.difficulty]}`}
                            >
                              {problem.difficulty}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              {problem.tag}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {problem.hasEditorial ? (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Editorial
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              <AlertCircle className="h-3.5 w-3.5" />
                              No Editorial
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {!isLoading && !problems.length ? (
                      <EmptyState>No problems created yet.</EmptyState>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
