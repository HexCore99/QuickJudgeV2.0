import { useOutletContext } from "react-router-dom";
import ContestProblemsTable from "./ContestProblemsTable";

function ContestProblemsPage() {
  const { contestDetails, contestId } = useOutletContext();

  return (
    <ContestProblemsTable
      contestId={contestId}
      contestTitle={contestDetails?.title}
      problems={contestDetails?.problems || []}
    />
  );
}

export default ContestProblemsPage;
