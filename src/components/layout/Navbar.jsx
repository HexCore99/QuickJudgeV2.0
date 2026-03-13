import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex gap-4 text-2xl font-black tracking-tight text-slate-900"
        >
          <Terminal />
          <span>QuickJudge</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

/*
TODO:
1. Add Up a good Logo
*/
