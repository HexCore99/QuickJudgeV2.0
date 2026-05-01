import { Calendar, Clock, Globe, Lock, Shield, Trophy } from "lucide-react";

const inputClasses =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";

function formatDurationPreview(startTime, endTime) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "";
  }

  const totalMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (60 * 1000),
  );

  if (totalMinutes <= 0) return "End time must be after start time";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

export default function CreateContestSettings({
  formData,
  isPrivate,
  isRated,
  onAccessChange,
  onChange,
  onRatingChange,
}) {
  const displayedIsPrivate = isPrivate && !isRated;
  const durationPreview = formatDurationPreview(
    formData.startTime,
    formData.endTime,
  );
  const canSaveSchedule =
    formData.startTime &&
    formData.endTime &&
    new Date(formData.endTime) > new Date(formData.startTime);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
          Schedule
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
              Start Time
            </label>
            <div className="relative">
              <Calendar className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={onChange}
                className={`${inputClasses} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
              End Time
            </label>
            <div className="relative">
              <Clock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={onChange}
                className={`${inputClasses} pl-10`}
              />
            </div>
          </div>
          {durationPreview && (
            <p
              className={`rounded-xl px-4 py-2 text-sm ${
                canSaveSchedule
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              Duration: {durationPreview}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
          Contest Rating
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onRatingChange(true)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isRated
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-[12px] font-semibold">Rated</span>
          </button>
          <button
            type="button"
            onClick={() => onRatingChange(false)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
              !isRated
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Shield className="h-5 w-5" />
            <span className="text-[12px] font-semibold">Unrated</span>
          </button>
        </div>

        {isRated && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-700">
            Rated contests are public only, so private access is disabled.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
          Access Control
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAccessChange(false)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
              !displayedIsPrivate
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Globe className="h-5 w-5" />
            <span className="text-[12px] font-semibold">Public</span>
          </button>
          <button
            type="button"
            disabled={isRated}
            onClick={() => onAccessChange(true)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
              displayedIsPrivate
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Lock className="h-5 w-5" />
            <span className="text-[12px] font-semibold">Private</span>
          </button>
        </div>

        {displayedIsPrivate && (
          <div className="mt-4 animate-[fadeSlideDown_0.2s_ease]">
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
              Contest Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Enter password..."
              className={inputClasses}
            />
          </div>
        )}
      </div>
    </div>
  );
}
