function ContestSectionTitle({ icon: Icon, title, live = false }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {live ? (
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
      ) : (
        <Icon className="h-4 w-4 text-slate-500" />
      )}

      <h2 className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
        {title}
      </h2>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export default ContestSectionTitle;
