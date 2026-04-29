import { useMemo } from "react";
import Heatmap from "./Heatmap";

// Generate LeetCode-style heatmap data for past year
function generateHeatmapData() {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Start from the Sunday of the week of oneYearAgo
  const start = new Date(oneYearAgo);
  start.setDate(start.getDate() - start.getDay());

  const days = [];
  const current = new Date(start);
  while (current <= today) {
    const raw = Math.random();
    const val = raw < 0.5 ? 0 : Math.ceil(raw * 7);

    days.push({
      date: new Date(current),
      count: val,
    });
    current.setDate(current.getDate() + 1);
  }

  // Group into weeks (columns)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return { weeks, days };
}

export default function OverviewPanel() {
  const { weeks } = useMemo(() => generateHeatmapData(), []);

  // Total submissions this year
  const totalSubmissions = useMemo(
    () => weeks.flat().reduce((sum, d) => sum + d.count, 0),
    [weeks],
  );
  return (
    <div className="space-y-6">
      {/* LeetCode-style Activity Heatmap */}
      <section className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            {totalSubmissions} submissions in the past year
          </h2>
        </div>

        <Heatmap dataWeeks={weeks} />
      </section>
    </div>
  );
}
