import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Code2,
  Hourglass,
  Lock,
  Users,
} from "lucide-react";
import Info from "../common/Info";
import TagChip from "../common/TagChip";

function ContestListCard({
  contest,
  type = "live",
  onAction,
  isRegistered = false,
}) {
  const isLive = type === "live";
  const isUpcoming = type === "upcoming";
  const isPasswordProtected = isLive && contest.requiresPassword;
  const isDisabled = isUpcoming && isRegistered;

  const buttonText = isLive
    ? isPasswordProtected
      ? "Enter with Password"
      : "Enter Contest"
    : isRegistered
      ? "Registered"
      : "Register";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        isLive ? "border-emerald-200" : "border-slate-200"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          isLive ? "bg-emerald-500" : "bg-blue-500"
        }`}
      />

      {/* card content*/}
      <div className="ml-3">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">{contest.name}</h3>

          <span
            className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase ${
              isLive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {isLive && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            )}
            {isLive ? "Live" : "Upcoming"}
          </span>
        </div>

        <p className="mb-4 text-sm text-slate-500">{contest.desc}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {contest.tags?.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
          <Info icon={CalendarDays}>{contest.date}</Info>
          {contest.time && <Info icon={Clock3}>{contest.time}</Info>}
          <Info icon={Hourglass}>{contest.duration}</Info>
          <Info icon={Code2}>{contest.problems} problems</Info>
          {isLive && contest.participants && (
            <Info icon={Users}>{contest.participants} joined</Info>
          )}
        </div>

        <button
          type="button"
          disabled={isDisabled}
          onClick={() => onAction?.(contest, type)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
            isDisabled
              ? "cursor-not-allowed bg-slate-400 opacity-80"
              : isLive
                ? "bg-emerald-600 hover:scale-[1.02] hover:bg-emerald-700"
                : "bg-blue-600 hover:scale-[1.02] hover:bg-blue-700"
          }`}
        >
          {isPasswordProtected ? (
            <Lock className="h-4 w-4" />
          ) : isLive ? (
            <ArrowRight className="h-4 w-4" />
          ) : isRegistered ? (
            <Check className="h-4 w-4" />
          ) : null}

          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ContestListCard;
