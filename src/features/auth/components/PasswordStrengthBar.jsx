import { useMemo } from "react";

function PasswordStrengthBar({ password, showLabel = true }) {
  const strength = useMemo(() => computeStrength(password), [password]);

  return (
    <div className="space-y-2">
      {showLabel ? (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Password strength</span>
          <span className={`font-semibold ${strength.textClass}`}>
            {strength.label}
          </span>
        </div>
      ) : null}

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
        aria-label="Password strength progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={strength.percent}
      >
        <div
          className={`h-full rounded-full transition-[width] ${strength.barClass}`}
          style={{ width: `${strength.percent}%` }}
        />
      </div>

      <p className="text-xs text-slate-500">
        Use 10+ chars, mix upper/lower, number, symbol.
      </p>
    </div>
  );
}

function computeStrength(password) {
  const pwd = password || "";
  if (!pwd) {
    return {
      label: "-",
      percent: 0,
      barClass: "bg-slate-400",
      textClass: "text-slate-700",
    };
  }

  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 10) score += 1;
  if (/[a-z]/.test(pwd)) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  const maxScore = 6;
  const percent = Math.round((score / maxScore) * 100);

  const variants = [
    {
      min: 0,
      label: "Weak",
      barClass: "bg-red-500",
      textClass: "text-red-700",
    },
    {
      min: 3,
      label: "Okay",
      barClass: "bg-amber-500",
      textClass: "text-amber-700",
    },
    {
      min: 5,
      label: "Strong",
      barClass: "bg-emerald-500",
      textClass: "text-emerald-700",
    },
  ];

  const chosen =
    [...variants].reverse().find((variant) => score >= variant.min) ||
    variants[0];

  return {
    label: chosen.label,
    percent,
    barClass: chosen.barClass,
    textClass: chosen.textClass,
  };
}

export default PasswordStrengthBar;
