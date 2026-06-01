import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useParams } from "react-router-dom";
import Error from "../../../components/common/Error";
import Loading from "../../../components/common/Loading";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import ContestDetailsHeader from "../../../features/contests/components/contestDetails/ContestDetailsHeader";
import { clearContestDetails } from "../../../features/contests/contestsSlice";
import {
  selectContestDetails,
  selectContestDetailsError,
  selectContestDetailsLoading,
} from "../../../features/contests/contestsSelectors";
import { fetchContestDetails } from "../../../features/contests/contestsThunks";
import AdminContestTabs from "../../../features/admin/components/AdminContestTabs";

function AdminContestLayoutPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const contestDetails = useSelector(selectContestDetails);
  const isLoading = useSelector(selectContestDetailsLoading);
  const error = useSelector(selectContestDetailsError);

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

  if (!contestDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StudentTopTabs
        tabs={getCurrentAdminNavTabs()}
        logoTo="/"
        navExtra={<AdminMoreMenu />}
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4">
          <Link
            to="/admin/contests"
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            Back to contests
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <ContestDetailsHeader
            title={contestDetails.title}
            statusText={contestDetails.statusText}
            duration={contestDetails.duration}
            endTime={contestDetails.endTime}
          />

          <div className="p-6">
            <AdminContestTabs />
            <Outlet context={{ contestDetails, contestId }} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminContestLayoutPage;
