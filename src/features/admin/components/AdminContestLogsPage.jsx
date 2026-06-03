import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Monitor, ShieldCheck } from "lucide-react";
import { getAdminContestLogsApi } from "../adminContestLogsApi";

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBrowserLabel(userAgent) {
  const agent = String(userAgent || "").toLowerCase();

  if (agent.includes("edg/")) return "Edge";
  if (agent.includes("firefox/")) return "Firefox";
  if (agent.includes("chrome/") || agent.includes("chromium/")) return "Chrome";
  if (agent.includes("safari/")) return "Safari";
  return "Unknown";
}

function formatIpAddress(ipAddress) {
  const ip = String(ipAddress || "").trim();

  if (!ip) return "--";
  if (ip === "::1") return "localhost (::1)";
  if (ip === "127.0.0.1" || ip === "::ffff:127.0.0.1") {
    return "localhost (127.0.0.1)";
  }
  if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");

  return ip;
}

function getIpHistory(log) {
  if (Array.isArray(log.ipHistory) && log.ipHistory.length) {
    return log.ipHistory;
  }

  return [log.firstIp, log.lastIp]
    .filter(Boolean)
    .filter((ipAddress, index, allIps) => allIps.indexOf(ipAddress) === index)
    .map((ipAddress) => ({
      ipAddress,
      firstSeenAt: log.firstSeenAt,
      lastSeenAt: log.lastSeenAt,
      seenCount: 0,
    }));
}

function AdminContestLogsPage() {
  const { contestId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(
    async ({ signal, silent = false } = {}) => {
      if (!contestId) return;

      if (!silent) {
        setIsLoading(true);
      }

      setError("");

      try {
        const nextData = await getAdminContestLogsApi(contestId, { signal });
        setData(nextData);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setError(err.message || "Failed to load contest logs.");
      } finally {
        if (!signal?.aborted && !silent) {
          setIsLoading(false);
        }
      }
    },
    [contestId],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadLogs({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [loadLogs]);

  useEffect(() => {
    if (data?.contestStatus !== "live" || data?.isFrozen) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      loadLogs({ silent: true });
    }, 20000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [data?.contestStatus, data?.isFrozen, loadLogs]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        Loading contest logs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  const logs = data?.logs || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Contest Logs
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {logs.length} {logs.length === 1 ? "student" : "students"} tracked
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data?.isFrozen ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <ShieldCheck size={14} />
              Logs frozen after contest ended
            </span>
          ) : data?.contestStatus === "live" ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <Clock size={14} />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
              <Clock size={14} />
              Upcoming
            </span>
          )}
        </div>
      </div>

      {!logs.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
          No contest session logs yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Email/Handle</th>
                  <th className="px-4 py-3">First IP</th>
                  <th className="px-4 py-3">Last IP</th>
                  <th className="px-4 py-3">IP List</th>
                  <th className="px-4 py-3">Browser</th>
                  <th className="px-4 py-3">First Seen</th>
                  <th className="px-4 py-3">Last Seen</th>
                  <th className="px-4 py-3 text-right">IP Changes</th>
                  <th className="px-4 py-3 text-right">Browser Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.userId} className="align-top">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {log.studentName || "Unknown student"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <span className="block whitespace-nowrap">
                        {log.studentEmail || "--"}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {log.studentHandle ? `@${log.studentHandle}` : "--"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      <span title={log.firstIp || ""}>
                        {formatIpAddress(log.firstIp)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      <span title={log.lastIp || ""}>
                        {formatIpAddress(log.lastIp)}
                      </span>
                    </td>
                    <td className="min-w-56 px-4 py-3 text-slate-500">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {getIpHistory(log).length ? (
                          getIpHistory(log).map((entry) => (
                            <span
                              key={`${entry.ipAddress}-${entry.firstSeenAt}`}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-600"
                              title={`First seen: ${formatDate(entry.firstSeenAt)} | Last seen: ${formatDate(entry.lastSeenAt)}`}
                            >
                              {formatIpAddress(entry.ipAddress)}
                              {entry.seenCount ? (
                                <span className="font-sans text-slate-400">
                                  x{entry.seenCount}
                                </span>
                              ) : null}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-slate-500">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                        <Monitor size={14} />
                        {getBrowserLabel(log.userAgent)}
                      </span>
                      <span
                        className="mt-1 block truncate text-xs text-slate-400"
                        title={log.userAgent || ""}
                      >
                        {log.userAgent || "--"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {formatDate(log.firstSeenAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {formatDate(log.lastSeenAt)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      {log.ipChangeCount}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      {log.browserChangeCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContestLogsPage;
