import { Link } from "react-router-dom";
import { History } from "lucide-react";
import Button from "../common/Button";
import ContestSectionTitle from "./ContestSectionTitle";
import PastContestRow from "./PastContestRow";

const pastContestFilters = [
  { key: "all", label: "All" },
  { key: "rated", label: "Rated" },
  { key: "unrated", label: "Unrated" },
];

function PastContestTable({
  contests,
  pastFilter,
  setPastFilter,
  footerLinkTo,
  footerLinkLabel = "View all past contests",
  showFooterLink = false,
}) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ContestSectionTitle title="Past Contests" icon={History} />

        <div className="inline-flex w-fit rounded-xl bg-slate-100 p-1">
          {pastContestFilters.map((item) => (
            <Button
              key={item.key}
              type="button"
              variant="segmented"
              active={pastFilter === item.key}
              onClick={() => setPastFilter(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* table*/}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase md:grid md:grid-cols-[2.2fr_1.4fr_0.8fr_0.8fr]">
          <div>Contest</div>
          <div>Tags</div>
          <div className="text-center">Rank</div>
          <div className="text-center">Questions</div>
        </div>

        {contests.length > 0 ? (
          contests.map((contest) => (
            <PastContestRow key={contest.id} contest={contest} />
          ))
        ) : (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No contests match your filters.
          </div>
        )}
      </div>

      {showFooterLink && footerLinkTo && contests.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Link
            to={footerLinkTo}
            className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            {footerLinkLabel}
          </Link>
        </div>
      )}
    </section>
  );
}

export default PastContestTable;
