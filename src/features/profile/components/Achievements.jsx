import {
  Brain,
  Code,
  Crown,
  Flame,
  Gem,
  Infinity as InfinityIcon,
  Rocket,
  Shield,
  Star,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

const lucideIcons = {
  Zap,
  Flame,
  Star,
  Crown,
  Code,
  Rocket,
  Brain,
  Gem,
  Shield,
  Swords,
  Infinity: InfinityIcon,
  Trophy,
};

export default function Achievements({ achievements }) {
  return (
    <div className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Achievements</h2>
        <span className="font-mono text-xs text-slate-500">
          {achievements.filter((achievement) => !achievement.locked).length} /
          {achievements.length}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {achievements.map((achievement) => {
          const Icon = lucideIcons[achievement.icon] || Zap;

          return (
            <div
              key={achievement.label}
              title={achievement.label + (achievement.locked ? " (Locked)" : "")}
              className={`flex h-14 w-14 cursor-default items-center justify-center rounded-[14px] text-xl transition-all ${
                achievement.locked
                  ? "opacity-25 grayscale"
                  : "hover:-translate-y-0.5 hover:scale-105"
              } ${achievement.bg}`}
            >
              <Icon className={`h-5 w-5 ${achievement.color}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
