import ContestListCard from "./ContestListCard";

function ContestSection({
  title,
  icon,
  contests,
  onEnterContest,
  onViewResult,
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-300 px-10 py-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-slate-500">{icon}</span>
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
      </div>

      <div className="space-y-4">
        {contests.map((contest) => (
          <ContestListCard
            key={contest.id}
            contest={contest}
            onEnterContest={onEnterContest}
            onViewContest={onViewResult}
          />
        ))}
      </div>
    </section>
  );
}

export default ContestSection;
