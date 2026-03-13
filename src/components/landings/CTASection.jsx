import { Link } from "react-router-dom";
function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-3xl bg-slate-900 px-6 py-15 text-center text-white shadow-lg">
        <h2 className="font-mono text-4xl font-black md:text-5xl">
          Rady to Start ?
        </h2>
        <p className="teext-xl mt-6 text-slate-300">
          Set up your first contest in minutes
        </p>

        <div className="mt-10">
          <Link
            to="/login"
            className="inline-block rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
