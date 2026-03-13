import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-slate-500">
        <Link to="/" className="font-semibold text-slate-400">
          <span className="mr-2">{">_"}</span>
          QuickJudge
        </Link>

        <p>© 2026 QuickJudge. Built for learning.</p>
      </div>
    </footer>
  );
}

export default Footer;
