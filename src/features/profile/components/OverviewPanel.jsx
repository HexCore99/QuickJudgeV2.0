import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Heatmap from "./Heatmap";

const ranges = ["6m", "1y", "all"];
const fallbackRatingHistory = {
  "6m": [],
  "1y": [],
  all: [],
};

function getRatingSeries(ratingHistory, range) {
  const data = ratingHistory?.[range] || fallbackRatingHistory[range];

  if (data.length >= 2) return data;

  return [];
}

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

export default function OverviewPanel({
  ratingHistory = fallbackRatingHistory,
  submissions = [],
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [chartRange, setChartRange] = useState("6m");

  const drawChart = useCallback(
    (range) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0) return;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const data = getRatingSeries(ratingHistory, range);
      ctx.clearRect(0, 0, w, h);

      if (!data.length) return;

      const pad = { t: 20, r: 20, b: 35, l: 50 };
      const cW = w - pad.l - pad.r;
      const cH = h - pad.t - pad.b;
      const minV = Math.min(...data.map((d) => d.v)) - 40;
      const maxV = Math.max(...data.map((d) => d.v)) + 40;
      const rng = maxV - minV;

      // Grid lines
      ctx.strokeStyle = "rgba(0,0,0,.05)";
      ctx.lineWidth = 1;
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.textAlign = "right";

      for (let i = 0; i <= 5; i++) {
        const y = pad.t + (cH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
        ctx.fillText(Math.round(maxV - (rng / 5) * i), pad.l - 8, y + 3);
      }

      // X labels
      ctx.textAlign = "center";
      data.forEach((d, i) => {
        ctx.fillText(d.l, pad.l + (cW / (data.length - 1)) * i, h - 8);
      });

      // Points
      const pts = data.map((d, i) => ({
        x: pad.l + (cW / (data.length - 1)) * i,
        y: pad.t + cH - ((d.v - minV) / rng) * cH,
      }));

      // Gradient fill
      const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
      grad.addColorStop(0, "rgba(194,133,10,0.15)");
      grad.addColorStop(1, "rgba(194,133,10,0)");

      ctx.beginPath();
      ctx.moveTo(pts[0].x, h - pad.b);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, h - pad.b);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Bezier line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length; j++) {
        const cx = (pts[j - 1].x + pts[j].x) / 2;
        ctx.bezierCurveTo(cx, pts[j - 1].y, cx, pts[j].y, pts[j].x, pts[j].y);
      }
      ctx.strokeStyle = "#c2850a";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dots
      pts.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = i === pts.length - 1 ? "#c2850a" : "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#c2850a";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Last value label
      const last = pts[pts.length - 1];
      ctx.font = "bold 12px JetBrains Mono, monospace";
      ctx.fillStyle = "#c2850a";
      ctx.textAlign = "left";
      ctx.fillText(data[data.length - 1].v, last.x + 10, last.y + 4);
    },
    [ratingHistory],
  );

  useEffect(() => {
    requestAnimationFrame(() => drawChart(chartRange));

    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => drawChart(chartRange), 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [chartRange, drawChart]);

  // Generate heatmap data (memoized so it stays stable)
  const hasRatingHistory =
    getRatingSeries(ratingHistory, chartRange).length > 0;
  const { weeks } = useMemo(() => buildHeatmapData(submissions), [submissions]);

  // Total submissions this year
  const totalSubmissions = useMemo(
    () => weeks.flat().reduce((sum, d) => sum + d.count, 0),
    [weeks],
  );
  return (
    <div className="space-y-6">
      {/* Rating History */}
      <section className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Rating History</h2>
          <div className="flex gap-1 rounded-[10px] bg-slate-100 p-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  chartRange === r
                    ? "bg-amber-600/7 text-amber-600"
                    : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div ref={containerRef} className="relative h-[220px] w-full">
          <canvas ref={canvasRef} className="h-full w-full" />
          {!hasRatingHistory && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
              No rating history yet
            </div>
          )}
        </div>
      </section>

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
