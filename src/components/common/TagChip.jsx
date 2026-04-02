function TagChip({ children }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">
      #{children}
    </span>
  );
}

export default TagChip;
