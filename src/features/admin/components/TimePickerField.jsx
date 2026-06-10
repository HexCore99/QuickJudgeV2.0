import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

function formatHourLabel(hourText) {
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")} ${suffix}`;
}

function formatTimeLabel(value) {
  if (!value) return "--:-- --";

  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return "--:-- --";
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getTimeParts(value) {
  const [hour = "", minute = ""] = value ? value.split(":") : [];

  return {
    hour,
    minute,
  };
}

function timeToMinutes(value) {
  if (!value) return null;

  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
}

function isTimeBeforeMinimum(hour, minute, minValue) {
  const minimumMinutes = timeToMinutes(minValue);

  if (minimumMinutes === null) return false;

  return Number(hour) * 60 + Number(minute) < minimumMinutes;
}

function getAllowedMinuteForHour(hour, selectedMinute, minValue) {
  const minimumMinutes = timeToMinutes(minValue);
  const fallbackMinute = selectedMinute || "00";

  if (minimumMinutes === null) return fallbackMinute;

  const candidateMinutes = Number(hour) * 60 + Number(fallbackMinute);

  if (candidateMinutes >= minimumMinutes) return fallbackMinute;

  const minimumHour = Math.floor(minimumMinutes / 60);

  return Number(hour) === minimumHour
    ? String(minimumMinutes % 60).padStart(2, "0")
    : "00";
}

export default function TimePickerField({
  value,
  onChange,
  disabled = false,
  inputClasses,
  lockedClasses = "",
  minValue = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const { hour: selectedHour, minute: selectedMinute } = getTimeParts(value);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function selectHour(nextHour) {
    if (isTimeBeforeMinimum(nextHour, "59", minValue)) return;

    onChange(
      `${nextHour}:${getAllowedMinuteForHour(
        nextHour,
        selectedMinute,
        minValue,
      )}`,
    );
  }

  function selectMinute(nextMinute) {
    if (isTimeBeforeMinimum(selectedHour || "00", nextMinute, minValue)) {
      return;
    }

    onChange(`${selectedHour || "00"}:${nextMinute}`);
    setIsOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((current) => !current)}
        className={`${inputClasses} ${lockedClasses} relative flex items-center justify-between gap-3 pl-10 text-left disabled:cursor-not-allowed`}
      >
        <Clock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <span
          className={
            value
              ? "font-mono text-slate-700"
              : "font-mono text-slate-400"
          }
        >
          {formatTimeLabel(value)}
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 z-40 mt-2 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400">
                HOUR
              </p>
              <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
                {HOURS.map((hour) => {
                  const isDisabled = isTimeBeforeMinimum(
                    hour,
                    "59",
                    minValue,
                  );

                  return (
                    <button
                      key={hour}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => selectHour(hour)}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold transition disabled:cursor-not-allowed disabled:text-slate-300 ${
                        selectedHour === hour
                          ? "bg-amber-100 text-amber-700 disabled:bg-slate-50"
                          : "text-slate-600 hover:bg-slate-100 disabled:hover:bg-transparent"
                      }`}
                    >
                      {formatHourLabel(hour)}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400">
                MIN
              </p>
              <div className="max-h-44 grid grid-cols-2 gap-1 overflow-y-auto pr-1">
                {MINUTES.map((minute) => {
                  const isDisabled = isTimeBeforeMinimum(
                    selectedHour || "00",
                    minute,
                    minValue,
                  );

                  return (
                    <button
                      key={minute}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => selectMinute(minute)}
                      className={`rounded-lg px-2 py-1.5 text-center font-mono text-xs font-semibold transition disabled:cursor-not-allowed disabled:text-slate-300 ${
                        selectedMinute === minute
                          ? "bg-amber-100 text-amber-700 disabled:bg-slate-50"
                          : "text-slate-600 hover:bg-slate-100 disabled:hover:bg-transparent"
                      }`}
                    >
                      {minute}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
