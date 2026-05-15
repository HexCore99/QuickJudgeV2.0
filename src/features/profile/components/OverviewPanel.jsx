import { useMemo } from "react";
import Heatmap from "./Heatmap";

function getDateKey(value) {
  if (!value) return null;

  const datePart = String(value).split(" ")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildHeatmapData(submissions = []) {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Start from the Sunday of the week of oneYearAgo
  const start = new Date(oneYearAgo);
  start.setDate(start.getDate() - start.getDay());

  const countsByDate = submissions.reduce((acc, submission) => {
    const key = getDateKey(submission.at);
    if (!key) return acc;

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const days = [];
  const current = new Date(start);
  while (current <= today) {
    const key = getDateKey(current);

    days.push({
      date: new Date(current),
      count: countsByDate[key] || 0,
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

export default function OverviewPanel({ submissions = [] }) {
  const { weeks } = useMemo(() => buildHeatmapData(submissions), [submissions]);

  const totalSubmissions = useMemo(
    () => weeks.flat().reduce((sum, d) => sum + d.count, 0),
    [weeks],
  );
  return (
    <div className="space-y-6">
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
