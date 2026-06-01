import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit2,
  FileText,
  Filter,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import {
  selectContestsError,
  selectContestsLoading,
  selectLiveContests,
  selectPastContests,
  selectUpcomingContests,
} from "../../../features/contests/contestsSelectors";
import {
  deleteContestThunk,
  fetchContests,
} from "../../../features/contests/contestsThunks";

const statusStyles = {
  Running: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  Ended: "bg-slate-100 text-slate-500 border-slate-200",
};

function buildContestRows(live, upcoming, past) {
  return [
    ...live.map((contest) => ({
      id: contest.id,
      title: contest.name,
      status: "Running",
      startTime: contest.startTime,
      endTime: contest.endTime,
      participants: contest.participants || 0,
      problems: contest.problems || 0,
      date: contest.date,
    })),
    ...upcoming.map((contest) => ({
      id: contest.id,
      title: contest.name,
      status: "Upcoming",
      startTime: contest.startTime,
      endTime: contest.endTime,
      participants: contest.participants || 0,
      problems: contest.problems || 0,
      date: contest.date,
    })),
    ...past.map((contest) => ({
      id: contest.id,
      title: contest.name,
      status: "Ended",
      isEditable: false,
      startTime: contest.startTime,
      endTime: contest.endTime,
      participants: contest.total || 0,
      problems: contest.questions || 0,
      date: contest.date,
    })),
  ];
}

export default function AdminContestsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const live = useSelector(selectLiveContests);
  const upcoming = useSelector(selectUpcomingContests);
  const past = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const error = useSelector(selectContestsError);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [actionError, setActionError] = useState(null);
  const [deletingContestId, setDeletingContestId] = useState(null);

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  const contests = useMemo(
    () => buildContestRows(live, upcoming, past),
    [live, upcoming, past],
  );

  const filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || contest.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  function openContest(contestId) {
    navigate(`/admin/contests/${contestId}/problems`);
  }

  async function handleDelete(contest) {
    const shouldDelete = window.confirm(`Delete "${contest.title}"?`);

    if (!shouldDelete) return;

    setDeletingContestId(contest.id);
    setActionError(null);

    const result = await dispatch(deleteContestThunk(contest.id));

    setDeletingContestId(null);

    if (deleteContestThunk.fulfilled.match(result)) {
      dispatch(fetchContests());
      return;
    }

    setActionError(result.payload || "Failed to delete contest.");
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
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Manage Contests
              </h1>
              <p className="mt-1 text-[14px] text-slate-500">
                Create, schedule, and moderate competitive programming contests.
              </p>
            </div>

            <Link
              to="/admin/contests/create"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <Plus className="h-4 w-4" />
              Create Contest
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {actionError && (
              <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-center text-sm text-red-600">
                {actionError}
              </div>
            )}

            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-10 text-[13px] transition outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-[13px] font-medium text-slate-600">
                    Status:
                  </span>
                </div>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  {["All", "Running", "Upcoming", "Ended"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilterStatus(status)}
                      className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
                        filterStatus === status
                          ? "bg-white text-amber-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Contest Title
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Participants
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Problems
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        Loading contests...
                      </td>
                    </tr>
                  )}

                  {!isLoading && error && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-[13px] text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    !error &&
                    filteredContests.map((contest) => (
                      <tr
                        key={contest.id}
                        onClick={() => openContest(contest.id)}
                        className="cursor-pointer border-b border-slate-50 transition last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/contests/${contest.id}/problems`}
                            className="text-[14px] font-semibold text-slate-800 transition-colors hover:text-amber-700"
                          >
                            {contest.title}
                          </Link>
                          <div className="mt-1 text-[12px] text-slate-400">
                            {contest.date}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${statusStyles[contest.status]}`}
                          >
                            {contest.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                            <Users className="h-4 w-4 text-slate-400" />
                            {contest.participants}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                            <FileText className="h-4 w-4 text-slate-400" />
                            {contest.problems}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={contest.isEditable === false}
                              title={
                                contest.isEditable === false
                                  ? "Ended contests cannot be edited"
                                  : "Edit contest"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                if (contest.isEditable === false) return;
                                navigate(`/admin/contests/${contest.id}/edit`);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:border-slate-200 disabled:hover:bg-slate-50"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingContestId === contest.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(contest);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {deletingContestId === contest.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!isLoading && !error && filteredContests.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        No contests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
