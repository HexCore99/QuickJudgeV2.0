import { useMemo } from "react";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayLabels = [
  { idx: 1, label: "Mon" },
  { idx: 3, label: "Wed" },
  { idx: 5, label: "Fri" },
];

export function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

const levelColors = [
  "bg-slate-100",           // 0: no submissions
  "bg-amber-200",           // 1: 1-2
  "bg-amber-400",           // 2: 3-4
  "bg-amber-500",           // 3: 5-6
  "bg-amber-700",           // 4: 7+
];

export default function Heatmap({ dataWeeks }) {
  // Compute month header positions
  const monthHeaders = useMemo(() => {
    const headers = [];
    let lastMonth = -1;
    dataWeeks.forEach((week, wi) => {
      // Use the first day of the week to determine month
      const firstDay = week[0];
      if (firstDay) {
        const m = firstDay.date.getMonth();
        if (m !== lastMonth) {
          headers.push({ month: monthNames[m], col: wi });
          lastMonth = m;
        }
      }
    });
    return headers;
  }, [dataWeeks]);

  // Set of week indices where a new month starts (skip the first)
  const monthStartWeeks = useMemo(
    () => new Set(monthHeaders.slice(1).map((h) => h.col)),
    [monthHeaders],
  );

  const cellSize = 13;
  const cellGap = 3;
  const monthGap = 10;
  const dayLabelWidth = 32;
  const headerHeight = 18;

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="w-max">
          {/* Month headers */}
          <div className="flex" style={{ paddingLeft: dayLabelWidth, height: headerHeight }}>
            {monthHeaders.map(({ month, col }, i) => {
              const nextCol = i < monthHeaders.length - 1 ? monthHeaders[i + 1].col : dataWeeks.length;
              const span = nextCol - col;
              return (
                <div
                  key={`${month}-${col}`}
                  className="text-[11px] text-slate-400"
                  style={{
                    width: span * cellSize + Math.max(0, span - 1) * cellGap,
                    flexShrink: 0,
                    marginLeft: i > 0 ? monthGap : 0,
                  }}
                >
                  {span > 2 ? month : ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex">
            {/* Day labels */}
            <div
              className="flex flex-col shrink-0"
              style={{ width: dayLabelWidth, gap: cellGap }}
            >
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const dl = dayLabels.find((d) => d.idx === dayIdx);
                return (
                  <div
                    key={dayIdx}
                    className="text-[10px] text-slate-400"
                    style={{
                      height: cellSize,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {dl ? dl.label : ""}
                  </div>
                );
              })}
            </div>

            {/* Week columns */}
            <div className="flex">
              {dataWeeks.map((week, wi) => {
                const isMonthStart = monthStartWeeks.has(wi);
                return (
                  <div 
                    key={wi} 
                    className="flex flex-col" 
                    style={{ 
                      gap: cellGap,
                      marginLeft: wi === 0 ? 0 : (isMonthStart ? monthGap : cellGap)
                    }}
                  >
                    {Array.from({ length: 7 }, (_, dayIdx) => {
                      const day = week[dayIdx];
                      if (!day) {
                        return (
                          <div
                            key={dayIdx}
                            style={{ width: cellSize, height: cellSize }}
                          />
                        );
                      }
                      const level = getLevel(day.count);
                      const dateStr = day.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      return (
                        <div
                          key={dayIdx}
                          className={`rounded-sm ${levelColors[level]} transition-colors hover:ring-1 hover:ring-slate-400`}
                          style={{
                            width: cellSize,
                            height: cellSize,
                          }}
                          title={
                            day.count === 0
                              ? `No submissions on ${dateStr}`
                              : `${day.count} submission${day.count > 1 ? "s" : ""} on ${dateStr}`
                          }
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>Less</span>
        {levelColors.map((cls, i) => (
          <div
            key={i}
            className={`h-[11px] w-[11px] rounded-sm ${cls}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
