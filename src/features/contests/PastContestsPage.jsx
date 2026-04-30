import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AppSearchInput from "../../components/common/AppSearchInput";
import StudentTopTabs from "../../components/layout/StudentTopTabs";
import PastContestTable from "./components/PastContestTable";
import {
  selectContestsError,
  selectContestsHasFetched,
  selectContestsLoading,
  selectPastContests,
} from "./contestsSelectors";
import { fetchContests } from "./contestsThunks";

function PastContestsHero({ search, setSearch }) {
  return (
    <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="pt-1">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/70 text-amber-700 shadow-sm">
            <History className="h-4.5 w-4.5" />
          </div>

          <div>
            <h1 className="text-[48px] leading-none font-bold tracking-[-0.04em] text-slate-800 md:text-[56px]">
              Past Contests
            </h1>
            <p className="mt-1.5 text-[14px] font-medium tracking-[0.01em] text-slate-500 md:text-[15px]">
              Browse all previous contests
            </p>
          </div>
        </div>
      </div>

      <AppSearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search past contests by name, type, or tag..."
        containerClassName="w-full max-w-md lg:mt-2"
      />
    </section>
  );
}

function PastContestsPage() {
  const dispatch = useDispatch();

  const pastContests = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const hasFetched = useSelector(selectContestsHasFetched);
  const error = useSelector(selectContestsError);

  const [pastFilter, setPastFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchContests());
    }
  }, [dispatch, hasFetched]);

  const query = search.trim().toLowerCase();

  const searchMatch = ({ name = "", desc = "", type = "", tags = [] }) => {
    if (!query) return true;

    const haystack = [name, desc, type, ...tags].join(" ").toLowerCase();
    return haystack.includes(query);
  };

  const filteredPast = pastContests.filter((contest) => {
    const matchesRated =
      pastFilter === "all" ||
      (pastFilter === "rated" && contest.rated) ||
      (pastFilter === "unrated" && !contest.rated);

    return matchesRated && searchMatch(contest);
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <StudentTopTabs logoTo="/" />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <PastContestsHero search={search} setSearch={setSearch} />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && !hasFetched ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500 shadow-sm">
            Loading past contests...
          </div>
        ) : (
          <PastContestTable
            contests={filteredPast}
            pastFilter={pastFilter}
            setPastFilter={setPastFilter}
          />
        )}
      </main>
    </div>
  );
}

export default PastContestsPage;
