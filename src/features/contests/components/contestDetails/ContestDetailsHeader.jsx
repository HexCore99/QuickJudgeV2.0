import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function calcTimeLeft(endTime, now = Date.now()) {
  const endTimestamp =
    typeof endTime === "number" ? endTime : new Date(endTime).getTime();
  const diff = Number.isFinite(endTimestamp)
    ? Math.max(0, endTimestamp - now)
    : 0;

  return {
    total: diff,
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function ContestCountdown({ endTime }) {
  const [now, setNow] = useState(() => Date.now());
  const timeLeft = calcTimeLeft(endTime, now);
  const isUrgent = timeLeft.total <= 10 * 60 * 1000;
  const isWarning = timeLeft.total <= 30 * 60 * 1000;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm transition-colors ${
        isUrgent
          ? "animate-pulse border-red-200 bg-red-50 text-red-600"
          : isWarning
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80">
        <Timer className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[11px] font-semibold tracking-wider uppercase opacity-70">
          Time left
        </span>
        <span className="font-mono text-xl font-black tabular-nums">
          {timeLeft.total <= 0
            ? "00:00:00"
            : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
        </span>
      </span>
    </div>
  );
}

export default function ContestDetailsHeader({
  title,
  statusText,
  duration,
  endTime,
}) {
  const normalizedStatus = String(statusText || "").toLowerCase();
  const showTimer =
    Boolean(endTime) &&
    (normalizedStatus === "live" || normalizedStatus === "running");

  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{title}</h1>

          <p className="mt-1 text-sm text-slate-500">
            <span>Status: {statusText}</span>
            <span className="mx-2">|</span>
            <span>Duration: {duration}</span>
          </p>
        </div>

        {showTimer && <ContestCountdown endTime={endTime} />}
      </div>
    </div>
  );
}
