import { useEffect, useRef } from "react";

export default function ProblemBreakdown({ difficulties }) {
  const barRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      barRefs.current.forEach((bar) => {
        if (bar) {
          const targetWidth = bar.getAttribute("data-w");
          bar.style.width = targetWidth + "%";
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <h2 className="mb-5 font-semibold text-slate-800">
        Problem Breakdown
      </h2>
      <div className="space-y-4">
        {difficulties.map((difficulty, index) => {
          const pct = Math.max(
            Math.round((difficulty.solved / difficulty.total) * 100),
            2,
          );

          return (
            <div key={difficulty.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: difficulty.color }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: difficulty.color }}
                  />
                  {difficulty.label}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {difficulty.solved} / {difficulty.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  ref={(el) => (barRefs.current[index] = el)}
                  data-w={pct}
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: "0%",
                    background: difficulty.color,
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
