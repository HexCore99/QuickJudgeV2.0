import {
    Check,
    X,
    TrendingUp,
    Flag,
    Flame,
    Trophy,
    Send
  } from "lucide-react";
  
  const typeMap = {
    solve: {
      bg: "bg-green-600/7",
      color: "text-green-600",
      Icon: Check,
    },
    fail: {
      bg: "bg-red-600/6",
      color: "text-red-600",
      Icon: X,
    },
    rating: {
      bg: "bg-amber-600/7",
      color: "text-amber-600",
      Icon: TrendingUp,
    },
    contest: {
      bg: "bg-blue-600/6",
      color: "text-blue-600",
      Icon: Flag,
    },
    streak: {
      bg: "bg-amber-600/7",
      color: "text-amber-600",
      Icon: Flame,
    },
    achievement: {
      bg: "bg-violet-600/6",
      color: "text-violet-600",
      Icon: Trophy,
    },
  };
  
  const verdictBg = {
    ac: "bg-green-600/8 text-green-600",
    wa: "bg-red-600/8 text-red-600",
    tle: "bg-amber-500/8 text-amber-500",
    re: "bg-red-600/5 text-red-700",
    ce: "bg-slate-500/8 text-slate-600",
  };
  
  export default function ActivityPanel({
    activities,
    submissions,
    onOpenSubmission,
  }) {
    return (
      <section className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <h2 className="mb-6 font-semibold text-slate-800">Activity Feed</h2>
        <div>
          {activities.map((a, i) => {
            const t = typeMap[a.type] || typeMap.solve;
            const Icon = t.Icon;
  
            let content;
            if (a.type === "solve" || a.type === "fail") {
              const subIdx = submissions.findIndex((s) => s.id === a.id);
              content = (
                <>
                  {a.type === "solve" ? "Solved " : "Failed "}
                  <strong className="text-slate-800">{a.problem}</strong>{" "}
                  <button
                    onClick={() => subIdx >= 0 && onOpenSubmission(subIdx)}
                    className={`cursor-pointer rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide transition-all hover:scale-105 ${
                      verdictBg[a.verdict?.toLowerCase()] || ""
                    }`}
                  >
                    {a.verdict}
                  </button>
                </>
              );
            } else if (a.type === "rating") {
              content = (
                <>
                  <strong className="text-amber-600">{a.title}</strong>{" "}
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-green-600">
                    ({a.change})
                  </span>
                </>
              );
            } else if (a.type === "contest") {
              content = (
                <>
                  Participated in{" "}
                  <strong className="text-slate-800">{a.title}</strong> —{" "}
                  <span className="text-blue-600">{a.result}</span>
                </>
              );
            } else if (a.type === "streak") {
              content = (
                <strong className="text-amber-600">{a.title}</strong>
              );
            } else {
              content = (
                <strong className="text-violet-600">{a.title}</strong>
              );
            }
  
            return (
              <div key={i} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.bg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${t.color}`} />
                  </div>
                  {i < activities.length - 1 && (
                    <div
                      className="ml-0 min-h-5 flex-1"
                      style={{
                        width: 2,
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)",
                      }}
                    />
                  )}
                </div>
                <div className="min-w-0 pb-5">
                  <div className="text-sm leading-relaxed text-slate-600">
                    {content}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {a.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  