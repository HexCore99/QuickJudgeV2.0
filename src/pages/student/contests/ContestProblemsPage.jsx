import { useOutletContext } from "react-router-dom";
import ContestProblemsTable from "../../../features/contests/components/contestDetails/ContestProblemsTable";

function ContestProblemsPage() {
  const { contestDetails } = useOutletContext();

  return <ContestProblemsTable problems={contestDetails?.problems || []} />;
}

export default ContestProblemsPage;
