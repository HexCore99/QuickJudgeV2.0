import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Filter,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import { getAdminAuditLogsApi } from "../../../features/admin/adminAuditLogsApi";

const EMPTY_FILTERS = {
  search: "",
  role: "all",
  action: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "student", label: "Student" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "SuperAdmin" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

const DEFAULT_ACTIONS = [
  "CREATE_ACCOUNT",
  "LOGIN",
  "CREATE_ADMIN",
  "SUSPEND_USER",
  "BAN_USER",
  "CREATE_CONTEST",
  "SUBMIT_CODE",
];

const ROLE_BADGE_CLASSES = {
  student: "border-blue-200 bg-blue-50 text-blue-700",
  admin: "border-violet-200 bg-violet-50 text-violet-700",
  super_admin: "border-orange-200 bg-orange-50 text-orange-700",
  unknown: "border-slate-200 bg-slate-50 text-slate-500",
};

const STATUS_BADGE_CLASSES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function getCurrentUser() {
  const userString = localStorage.getItem("qj_user");

  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
}

function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : dateTimeFormatter.format(date);
}

function formatText(value) {
  if (!value) return "Unknown";

  return String(value)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${className}`}
    >
      {children}
    </span>
  );
}

function SelectInput({ value, onChange, children, label }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={onChange}
      className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px] font-semibold text-slate-600 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
    >
      {children}
    </select>
  );
}

export default function AdminAuditLogsPage() {
  const currentUser = getCurrentUser();
  const currentUserRole = currentUser?.role;
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [logs, setLogs] = useState([]);
  const [actions, setActions] = useState(DEFAULT_ACTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const queryFilters = useMemo(
    () => ({
      search: filters.search.trim(),
      role: filters.role,
      action: filters.action,
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    }),
    [filters],
  );

  const actionOptions = useMemo(
    () => [...new Set([...DEFAULT_ACTIONS, ...actions])].sort(),
    [actions],
  );

  useEffect(() => {
    if (currentUserRole !== "super_admin") {
      return undefined;
    }

    let isCurrent = true;

    Promise.resolve()
      .then(() => {
        if (!isCurrent) return null;
        setIsLoading(true);
        setError("");
        return getAdminAuditLogsApi(queryFilters);
      })
      .then((data) => {
        if (!isCurrent || !data) return;
        setLogs(data.logs);
        setActions(data.actions.length ? data.actions : DEFAULT_ACTIONS);
      })
      .catch((fetchError) => {
        if (!isCurrent) return;
        setError(fetchError.message || "Failed to load audit logs.");
        setLogs([]);
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [currentUserRole, queryFilters]);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUserRole !== "super_admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

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
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-700 uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                Users & Logs / Audit Logs
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Audit Logs
              </h1>
              <p className="mt-1 text-[14px] text-slate-500">
                SuperAdmin-only page for reviewing important platform actions.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 shadow-sm">
              <Activity className="h-4 w-4 text-amber-600" />
              {logs.length} visible logs
            </div>
          </div>

          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-bold tracking-wider text-slate-500 uppercase">
                <Filter className="h-4 w-4 text-slate-400" />
                Filters
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.4fr)_repeat(3,minmax(150px,0.7fr))_minmax(250px,1fr)_auto]">
                <div className="relative min-w-0">
                  <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(event) =>
                      updateFilter("search", event.target.value)
                    }
                    placeholder="Search actor/target..."
                    className="h-11 w-full min-w-0 rounded-xl border border-slate-200 py-2.5 pr-4 pl-10 text-[13px] transition outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <SelectInput
                  label="Role filter"
                  value={filters.role}
                  onChange={(event) => updateFilter("role", event.target.value)}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectInput>

                <SelectInput
                  label="Action filter"
                  value={filters.action}
                  onChange={(event) =>
                    updateFilter("action", event.target.value)
                  }
                >
                  <option value="all">All Actions</option>
                  {actionOptions.map((action) => (
                    <option key={action} value={action}>
                      {formatText(action)}
                    </option>
                  ))}
                </SelectInput>

                <SelectInput
                  label="Status filter"
                  value={filters.status}
                  onChange={(event) =>
                    updateFilter("status", event.target.value)
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectInput>

                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="relative min-w-0">
                    <CalendarDays className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      aria-label="Date range start"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(event) =>
                        updateFilter("dateFrom", event.target.value)
                      }
                      className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-[13px] font-semibold text-slate-600 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <input
                    aria-label="Date range end"
                    type="date"
                    value={filters.dateTo}
                    onChange={(event) =>
                      updateFilter("dateTo", event.target.value)
                    }
                    className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px] font-semibold text-slate-600 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 xl:w-auto"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Time
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Actor
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Action
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Target
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        Loading audit logs...
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        No audit logs found.
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading &&
                    logs.map((log) => {
                      const role = log.actor?.role || "unknown";
                      const status = log.status || "failed";

                      return (
                        <tr
                          key={log.id}
                          className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50/60"
                        >
                          <td className="min-w-[190px] px-6 py-4 text-[13px] font-medium text-slate-500">
                            {formatDateTime(log.createdAt)}
                          </td>
                          <td className="min-w-[220px] px-4 py-4">
                            <div className="text-[14px] font-semibold text-slate-800">
                              {log.actor?.label || "Unknown actor"}
                            </div>
                            <div className="text-[12px] text-slate-400">
                              {log.actor?.email || `ID: ${log.actor?.id || "-"}`}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              className={
                                ROLE_BADGE_CLASSES[role] ||
                                ROLE_BADGE_CLASSES.unknown
                              }
                            >
                              {formatText(role)}
                            </Badge>
                          </td>
                          <td className="min-w-[170px] px-4 py-4">
                            <div className="text-[13px] font-bold text-slate-700">
                              {formatText(log.action)}
                            </div>
                            {log.message ? (
                              <div className="mt-1 max-w-[280px] truncate text-[12px] text-slate-400">
                                {log.message}
                              </div>
                            ) : null}
                          </td>
                          <td className="min-w-[220px] px-4 py-4">
                            <div className="text-[13px] font-semibold text-slate-700">
                              {log.target?.label || "Unknown target"}
                            </div>
                            <div className="text-[12px] text-slate-400">
                              {formatText(log.target?.type)}{" "}
                              {log.target?.id ? `#${log.target.id}` : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Badge className={STATUS_BADGE_CLASSES[status]}>
                              {status === "success" ? (
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                              )}
                              {formatText(status)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
