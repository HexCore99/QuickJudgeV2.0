import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchContestDetails } from "../../features/contests/contestsThunks";
import { clearContestDetails } from "../../features/contests/contestSlice";
import ContestDetailsHeader from "../../components/contest/contestDetails/ContestDetailsHeader";
import {
  selectContestDetails,
  selectContestDetailsError,
  selectContestDetailsLoading,
} from "../../features/contests/contestsSelectors";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import ContestProblemsTable from "../../components/contest/problems/ContestProblemsTable.jsx";
import ContestTabs from "../../components/contest/contestDetails/ContestTabs";

function ContestDetailsPage() {
  const { contestId } = useParams();
  const dispatch = useDispatch();

  const contestDetails = useSelector(selectContestDetails);
  const isLoading = useSelector(selectContestDetailsLoading);
  const error = useSelector(selectContestDetailsError);

  useEffect(() => {
    dispatch(fetchContestDetails(contestId));
  }, [contestId, dispatch]);

  if (isLoading) {
    return <Loading description="Loading contest details ..." />;
  }
  if (error) {
    return <Error error={error} />;
  }
  if (!contestDetails) {
    return null;
  }
  return (
    <div>
      {console.log(contestDetails)}
      <ContestDetailsHeader
        title={contestDetails.title}
        statusText={contestDetails.statusText}
        duration={contestDetails.duration}
      />
      <div>
        <ContestTabs />
        <ContestProblemsTable problems={contestDetails.problems} />
      </div>
    </div>
  );
}

export default ContestDetailsPage;
