import { Flag } from "lucide-react";
import AppSearchInput from "../common/AppSearchInput";

function ContestPageHeader({
  title = "Contests",
  subtitle = "Join and participate in programming contests",
  search,
  setSearch,
  searchPlaceholder = "Search contests by name, topic, or tag...",
  icon: Icon = Flag,
}) {
  return (
    <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="pt-1">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/70 text-amber-700 shadow-sm">
            <Icon className="h-4.5 w-4.5" />
          </div>

          <div>
            <h1 className="text-[48px] leading-none font-bold tracking-[-0.04em] text-slate-800 md:text-[56px]">
              {title}
            </h1>
            <p className="mt-1.5 text-[14px] font-medium tracking-[0.01em] text-slate-500 md:text-[15px]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <AppSearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
        containerClassName="w-full max-w-md lg:mt-2"
      />
    </section>
  );
}

export default ContestPageHeader;
