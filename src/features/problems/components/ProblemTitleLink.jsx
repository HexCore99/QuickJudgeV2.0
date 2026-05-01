import { Link } from "react-router-dom";
function ProblemTitleLink({ to, title, state = undefined }) {
  return (
    <Link
      to={to}
      state={state}
      className="truncate text-left text-sm text-slate-700"
    >
      {title}
    </Link>
  );
}

export default ProblemTitleLink;

