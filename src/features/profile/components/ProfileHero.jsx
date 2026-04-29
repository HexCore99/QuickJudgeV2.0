import Achievements from "./Achievements";
import ProblemBreakdown from "./ProblemBreakdown";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileStatsRow from "./ProfileStatsRow";
import RatingCard from "./RatingCard";

export default function ProfileHero({
  user,
  difficulties,
  achievements,
  onEditClick,
  onShareClick,
}) {
  const handle =
    user.handle || user.name;
  const bio = user.bio || "Competitive programmer and full-stack developer.";
  const lastVisit = user.lastVisit || "Today";

  return (
    <section
      className="mb-6 grid items-stretch gap-6"
      style={{ gridTemplateColumns: "1fr 320px" }}
    >
      {/* Left: Profile info + Stats */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/7 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ProfileAvatar name={user.name} />

          <ProfileInfo
            user={user}
            handle={handle}
            bio={bio}
            lastVisit={lastVisit}
            onEditClick={onEditClick}
            onShareClick={onShareClick}
          />

          <RatingCard rating={user.rating} />
        </div>

        <ProfileStatsRow user={user} />
      </div>

      {/* Right: Problem Breakdown + Achievements */}
      <div className="flex flex-col gap-6">
        <ProblemBreakdown difficulties={difficulties} />
        <Achievements achievements={achievements} />
      </div>
    </section>
  );
}
