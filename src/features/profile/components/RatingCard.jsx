export default function RatingCard({ rating }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 px-6 py-5 text-center shadow-sm">
      <div className="text-[10px] font-semibold tracking-wider text-slate-500">
        RATING
      </div>
      <div className="mt-1 font-mono text-3xl font-bold text-amber-700">
        {rating}
      </div>
    </div>
  );
}
