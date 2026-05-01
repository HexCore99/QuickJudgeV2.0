import { useEffect, useState } from "react";
import { ArrowLeft, Timer, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileDropdown from "../../../components/common/ProfileDropdown";

function calcTimeLeft(endTime) {
  const diff = Math.max(0, endTime - Date.now());

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

function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(endTime));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(calcTimeLeft(endTime));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endTime]);

  const isUrgent = timeLeft.total <= 10 * 60 * 1000;
  const isWarning = timeLeft.total <= 30 * 60 * 1000;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[13px] font-bold tabular-nums transition-colors ${
        isUrgent
          ? "animate-pulse border-red-200 bg-red-50 text-red-600"
          : isWarning
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <Timer
        size={14}
        className={
          isUrgent
            ? "text-red-500"
            : isWarning
              ? "text-amber-500"
              : "text-slate-400"
        }
      />
      {timeLeft.total <= 0
        ? "00:00:00"
        : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
    </div>
  );
}

function ProblemTopBar({ backTo, contestTitle, showContestTimer }) {
  const [mockContestEndTime] = useState(() => Date.now() + 2 * 60 * 60 * 1000);

  return (
    <header className="relative flex h-12 shrink-0 items-center justify-between border-b border-[#e8e4dd] bg-white px-4">
      <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400" />

      <div className="flex items-center gap-3">
        <Link
          to={backTo}
          className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
          title="Back"
        >
          <ArrowLeft size={16} />
        </Link>

        <div className="h-5 w-px bg-slate-200" />

        <Link to="/" className="flex items-center gap-2 transition hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span className="text-[13px] font-bold tracking-tight text-slate-800">
            QuickJudge
          </span>
          <span className="text-[11px] text-slate-400">V2.0</span>
        </Link>
      </div>

      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
        <span className="text-[13px] font-semibold text-slate-600">
          {contestTitle || "Practice Problem"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {showContestTimer && <CountdownTimer endTime={mockContestEndTime} />}
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default ProblemTopBar;
