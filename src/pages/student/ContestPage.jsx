import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Hourglass } from "lucide-react";
import ContestPageHeader from "../../components/contest/ContestPageHeader";
import ContestSection from "../../components/contest/ContestSection";
import ContestPasswordModal from "../../components/contest/ContestPasswordModal";
import {
  fetchContests,
  verifyContestPassword,
} from "../../features/contests/contestsThunks";

// selectors
import {
  selectContestPasswordModal,
  selectContestsError,
  selectContestsLoading,
  selectLiveContests,
  selectPastContests,
  selectUpcomingContests,
} from "../../features/contests/contestsSelectors";

// reducers
import {
  clearContestPasswordError,
  closeContestPasswordModal,
  openContestPasswordModal,
  setContestPasswordInput,
} from "../../features/contests/contestSlice";

function ContestPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const liveContests = useSelector(selectLiveContests);
  const upcomingContests = useSelector(selectUpcomingContests);
  const pastContests = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const error = useSelector(selectContestsError);
  const passwordModal = useSelector(selectContestPasswordModal);
  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  function handleOpenModal(contest) {
    dispatch(openContestPasswordModal(contest));
  }

  function handleCloseModal() {
    dispatch(closeContestPasswordModal());
  }

  function handlePasswordChange(value) {
    dispatch(setContestPasswordInput(value));

    if (passwordModal.error) {
      dispatch(clearContestPasswordError());
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (!passwordModal.contest) return;

    const resultAction = await dispatch(
      verifyContestPassword({
        contestId: passwordModal.contest.id,
        password: passwordModal.password,
      }),
    );


    if (verifyContestPassword.fulfilled.match(resultAction)) {
      navigate(`/student/contest/${passwordModal.contest.id}`);
    }
  }

  function handleViewResult(contest) {
    navigate(`/student/contest/${contest.id}`);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-100">
      <ContestPageHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
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
          <div className="mx-auto max-w-6xl space-y-8 px-6 pb-6">
            <ContestSection
              title="Live Contests"
              icon={<span className="text-emerald-600">{"\u26A1"}</span>}
              contests={liveContests}
              onEnterContest={handleOpenModal}
              onViewResult={handleViewResult}
            />

            <ContestSection
              title="Upcoming Contests"
              icon={<CalendarDays size={18} />}
              contests={upcomingContests}
              onEnterContest={handleOpenModal}
              onViewResult={handleViewResult}
            />

            <ContestSection
              title="Past Contests"
              icon={<Hourglass size={18} />}
              contests={pastContests}
              onEnterContest={handleOpenModal}
              onViewResult={handleViewResult}
            />
          </div>
        ) : null}
      </div>

      <ContestPasswordModal
        isOpen={passwordModal.isOpen}
        contest={passwordModal.contest}
        password={passwordModal.password}
        error={passwordModal.error}
        isSubmitting={passwordModal.isSubmitting}
        onClose={handleCloseModal}
        onChange={handlePasswordChange}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}

export default ContestPage;
