import { Terminal } from "lucide-react";
import { Link } from "react-router-dom";

function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-3xl font-black tracking-tight text-slate-900"
      >
        <span className="text-slate-700">
          <Terminal />
        </span>

        <span>QuickJudge</span>
      </Link>

      <h1 className="mt-6 font-mono text-3xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">{subtitle}</p>
    </div>
  );
}

export default AuthHeader;
