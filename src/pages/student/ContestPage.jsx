import ContestPageHeader from "../../components/contest/ContestPageHeader";
import ContestSection from "../../components/contest/ContestSection";
import { fetchContests } from "../../features/contests/contestsThunks";
import {
  selectContestsError,
  selectContestsLoading,
  selectLiveContests,
  selectPastContests,
  selectUpcomingContests,
} from "../../features/contests/contestsSelectors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { CalendarDays, Hourglass } from "lucide-react";

function ContestPage() {
  const dispatch = useDispatch();

  const liveContests = useSelector(selectLiveContests);
  const upcomingContests = useSelector(selectUpcomingContests);
  const pastContests = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const error = useSelector(selectContestsError);

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-slate-100">
      <ContestPageHeader />

      <div className="mx-auto max-w-6xl px-6 py-6">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
            Loading contests...
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      {!isLoading && !error ? (
        <div className="mx-w-6xl mx-auto max-h-screen space-y-8 overflow-x-scroll px-5">
          <ContestSection
            title="Live Contests"
            icon={<span className="text-emerald-600">⚡</span>}
            contests={liveContests}
          />

          <ContestSection
            title="Upcoming Contests"
            icon={<CalendarDays size={18} />}
            contests={upcomingContests}
          />

          <ContestSection
            title="Past Contests"
            icon={<Hourglass size={18} />}
            contests={pastContests}
          />
        </div>
      ) : null}
    </div>
  );
}

export default ContestPage;
