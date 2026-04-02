import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import StudentTopTabs from "../../components/layout/StudentTopTabs";
import ContestDetailsHeader from "../../components/contest/contestDetails/ContestDetailsHeader";
import ContestTabs from "../../components/contest/contestDetails/ContestTabs";
import ContestProblemsTable from "../../components/contest/contestDetails/ContestProblemsTable";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import { clearContestDetails } from "../../features/contests/contestSlice";
import {
  selectContestDetails,
  selectContestDetailsError,
  selectContestDetailsLoading,
} from "../../features/contests/contestsSelectors";
import { fetchContestDetails } from "../../features/contests/contestsThunks";

function ComingSoonCard({ title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
      {title} page will be added later.
    </div>
  );
}

function ContestDetailsPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();
  const { pathname } = useLocation();

  const contestDetails = useSelector(selectContestDetails);
  const isLoading = useSelector(selectContestDetailsLoading);
  const error = useSelector(selectContestDetailsError);

  const currentSection = pathname.split("/").pop();

  useEffect(() => {
    dispatch(fetchContestDetails(contestId));

    return () => {
      dispatch(clearContestDetails());
    };
  }, [dispatch, contestId]);

  if (isLoading) {
    return <Loading description="Loading contest details..." />;
  }

  if (error) {
    return <Error error={error} />;
  }

  const renderContent = () => {
    switch (currentSection) {
      case "problems":
        return (
          <ContestProblemsTable problems={contestDetails?.problems || []} />
        );

      case "submissions":
        return <ComingSoonCard title="Submissions" />;

      case "leaderboard":
        return <ComingSoonCard title="Leaderboard" />;

      case "announcements":
        return <ComingSoonCard title="Announcements" />;

      case "queries":
        return <ComingSoonCard title="Queries" />;

      default:
        return (
          <ContestProblemsTable problems={contestDetails?.problems || []} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StudentTopTabs activeTab="Contests" logoTo="/" />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4">
          <Link
            to="/student/contests"
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            ← Back to contests
          </Link>
        </div>

        {contestDetails ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <ContestDetailsHeader
              title={contestDetails.title}
              statusText={contestDetails.statusText}
              duration={contestDetails.duration}
            />

            <div className="p-6">
              <ContestTabs />
              {renderContent()}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default ContestDetailsPage;
