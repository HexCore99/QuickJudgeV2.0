import { Flag, Search } from "lucide-react";

function ContestPageHeader({ search, setSearch }) {
  return (
    <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      {/* Hero*/}
      <div className="pt-1">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/70 text-amber-700 shadow-sm">
            <Flag className="h-4.5 w-4.5" />
          </div>

          <div>
            <h1 className="text-[48px] leading-none font-bold tracking-[-0.04em] text-slate-800 md:text-[56px]">
              Contests
            </h1>
            <p className="mt-1.5 text-[14px] font-medium tracking-[0.01em] text-slate-500 md:text-[15px]">
              Join and participate in programming contests
            </p>
          </div>
        </div>
      </div>

      {/* Search*/}
      <div className="relative w-full max-w-md lg:mt-2">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contests by name, topic, or tag..."
          className="h-12 w-full rounded-2xl border border-[#dfdcd6] bg-white/85 pr-4 pl-11 text-[14px] text-slate-600 transition outline-none placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70"
        />
      </div>
    </section>
  );
}

export default ContestPageHeader;
