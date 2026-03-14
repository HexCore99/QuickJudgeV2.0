import { Link } from "react-router-dom";
function ProblemTitleLink({ to, title }) {
  return (
    <Link to={to} className="truncate text-left text-sm text-slate-700">
      {title}
    </Link>
  );
}

export default ProblemTitleLink;
