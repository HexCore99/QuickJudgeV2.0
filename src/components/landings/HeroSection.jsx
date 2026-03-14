import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
function HeroSection() {
  const languages = ["C", "C++", "Java", "Python"];
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-0.5 text-center">
      <div className="mb-5 flex rounded-full bg-slate-100 px-6 py-3 text-sm font-medium text-slate-500">
        <Terminal />
        <span>Educational Online Judge</span>
      </div>

      <h1 className="max-w-4xl font-mono text-4xl leading-tight font-black text-slate-900 md:text-5xl">
        Simple. Clean.
        <br />
        Problem Solving.
      </h1>

      <p className="mt-3 max-w-4xl text-xl leading-10 text-slate-500 md:text-xl">
        QuickJudge is a minimal online judge platform built for educational
        programming contests — no complexity, just code.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/login"
          className="rounded-2xl bg-slate-900 px-6 py-3 text-lg font-semibold text-white transition hover:bg-slate-800"
        >
          GetStarted
        </Link>
        <Link
          to="/login"
          className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-lg font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Login
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {languages.map((lang) => (
          <span
            key={lang}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500"
          >
            {lang}
          </span>
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
