import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, Flag } from "lucide-react";
import AppSearchInput from "../../../components/common/AppSearchInput";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import ContestFilterBar from "../../../features/contests/components/ContestFilterBar";
import ContestPasswordModal from "../../../features/contests/components/ContestPasswordModal";
import ContestSection from "../../../features/contests/components/ContestSection";
import PastContestTable from "../../../features/contests/components/PastContestTable";
import {
  clearContestPasswordError,
  closeContestPasswordModal,
  openContestPasswordModal,
  setContestPasswordInput,
} from "../../../features/contests/contestsSlice";
import {
  selectContestFilters,
  selectContestPasswordModal,
  selectContestsError,
  selectContestsHasFetched,
  selectContestsLoading,
  selectLiveContests,
  selectPastContests,
  selectSortedUpcomingContests,
} from "../../../features/contests/contestsSelectors";
import {
  fetchContests,
  registerUpcomingContest,
  verifyContestPassword,
} from "../../../features/contests/contestsThunks";

function ContestPageHero({ search, setSearch }) {
  return (
    <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="pt-1">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/70 text-amber-700 shadow-sm">
            <Flag className="h-4.5 w-4.5" />
          </div>

          <div>
            <h1 className="text-[48px] leading-none font-bold tracking-[-0.04em] text-slate-800 md:text-[56px]">
              Contests
            </h1>
            <p className="mt-1.5 text-[14px] font-medium tracking-[0.01em] text-slate-500 md:text-[15px]">
              Join and participate in programming contests
            </p>
          </div>
        </div>
      </div>

      <AppSearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search contests by name, topic, or tag..."
        containerClassName="w-full max-w-md lg:mt-2"
      />
    </section>
  );
}

function ContestPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contestFilters = useSelector(selectContestFilters);
  const liveContests = useSelector(selectLiveContests);
  const upcomingContests = useSelector(selectSortedUpcomingContests);
  const pastContests = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const hasFetched = useSelector(selectContestsHasFetched);
  const error = useSelector(selectContestsError);
  const passwordModal = useSelector(selectContestPasswordModal);

  const [activeFilter, setActiveFilter] = useState("all");
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

  const filteredLive = liveContests.filter(searchMatch);
  const filteredUpcoming = upcomingContests.filter(searchMatch);
  const filteredPast = pastContests.filter((contest) => {
    const matchesRated =
      pastFilter === "all" ||
      (pastFilter === "rated" && contest.rated) ||
      (pastFilter === "unrated" && !contest.rated);

    return matchesRated && searchMatch(contest);
  });

  const latestFivePastContests = filteredPast.slice(0, 5);

  const handleContestAction = (contest, type) => {
    if (type === "upcoming") {
      if (contest.registered) return;
      dispatch(registerUpcomingContest(contest.id));
      return;
    }

    if (contest.requiresPassword) {
      dispatch(openContestPasswordModal(contest));
      return;
    }

    navigate(`/student/${contest.id}/problems`);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordModal.contest) return;

    try {
      await dispatch(
        verifyContestPassword({
          contestId: passwordModal.contest.id,
          password: passwordModal.password,
        }),
      ).unwrap();

      navigate(`/student/${passwordModal.contest.id}/problems`);
    } catch {
      //
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <StudentTopTabs activeTab="Contests" logoTo="/" />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <ContestPageHero search={search} setSearch={setSearch} />

        <ContestFilterBar
          filters={contestFilters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setPastFilter={setPastFilter}
        />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && !hasFetched ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500 shadow-sm">
            Loading contests...
          </div>
        ) : (
          <>
            {(activeFilter === "all" || activeFilter === "live") && (
              <ContestSection
                title="Live Contests"
                icon={Clock3}
                contests={filteredLive}
                type="live"
                live
                onAction={handleContestAction}
              />
            )}

            {(activeFilter === "all" || activeFilter === "upcoming") && (
              <ContestSection
                title="Upcoming Contests"
                icon={CalendarDays}
                contests={filteredUpcoming}
                type="upcoming"
                onAction={handleContestAction}
              />
            )}

            {(activeFilter === "all" || activeFilter === "past") && (
              <PastContestTable
                contests={latestFivePastContests}
                pastFilter={pastFilter}
                setPastFilter={setPastFilter}
                showFooterLink
                footerLinkTo="/student/contests/past"
                footerLinkLabel="View all past contests"
              />
            )}
          </>
        )}
      </main>

      <ContestPasswordModal
        isOpen={passwordModal.isOpen}
        contest={passwordModal.contest}
        passwordInput={passwordModal.password}
        setPasswordInput={(value) => {
          dispatch(setContestPasswordInput(value));
          if (passwordModal.error) {
            dispatch(clearContestPasswordError());
          }
        }}
        error={passwordModal.error}
        isSubmitting={passwordModal.isSubmitting}
        onClose={() => dispatch(closeContestPasswordModal())}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}

export default ContestPage;
