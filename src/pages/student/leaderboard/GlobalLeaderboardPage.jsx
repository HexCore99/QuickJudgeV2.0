import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart3, RefreshCw } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import GlobalLeaderboardTable from "../../../features/leaderboard/components/GlobalLeaderboardTable";
import {
  selectGlobalLeaderboard,
  selectGlobalLeaderboardError,
  selectGlobalLeaderboardLoading,
} from "../../../features/leaderboard/leaderboardSelectors";
import { fetchGlobalLeaderboard } from "../../../features/leaderboard/leaderboardThunks";

function GlobalLeaderboardPage() {
  const dispatch = useDispatch();
  const entries = useSelector(selectGlobalLeaderboard);
  const isLoading = useSelector(selectGlobalLeaderboardLoading);
  const error = useSelector(selectGlobalLeaderboardError);

  useEffect(() => {
    dispatch(fetchGlobalLeaderboard());
  }, [dispatch]);

  const displayEntries = Array.isArray(entries) ? entries : [];

  function handleRefresh() {
    dispatch(fetchGlobalLeaderboard());
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7]">
      <StudentTopTabs />

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-600" />
            <h1 className="text-lg font-bold text-slate-800">
              Global Leaderboard
            </h1>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
            Could not load leaderboard from the backend: {error}
          </div>
        )}

        {isLoading && !displayEntries.length ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : (
          <GlobalLeaderboardTable entries={displayEntries} />
        )}
      </div>
    </div>
  );
}

export default GlobalLeaderboardPage;
