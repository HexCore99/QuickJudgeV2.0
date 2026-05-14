import ProblemBreakdown from "./ProblemBreakdown";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileStatsRow from "./ProfileStatsRow";
import RatingCard from "./RatingCard";

export default function ProfileHero({
  user,
  difficulties,
  submissions,
  onEditClick,
  onShareClick,
}) {
  const handle = user.handle || user.email?.split("@")[0] || user.name;
  const bio = user.bio || "Competitive programmer and full-stack developer.";
  const lastVisit = user.lastVisit || "Today";

  return (
    <section className="mb-6">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/7 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ProfileAvatar
            name={user.name}
            email={user.email}
            src={user.avatarUrl}
            onEditClick={onEditClick}
          />

          <ProfileInfo
            user={user}
            handle={handle}
            bio={bio}
            lastVisit={lastVisit}
            onEditClick={onEditClick}
            onShareClick={onShareClick}
          />

          <RatingCard rating={user.rating} ratingTier={user.ratingTier} />
        </div>

        <div className="mt-6 grid gap-6 border-t border-black/5 pt-5 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
              Performance
            </h2>
            <ProfileStatsRow user={user} />
          </div>
          <div className="lg:border-l lg:border-black/7 lg:pl-6">
            <ProblemBreakdown
              difficulties={difficulties}
              submissions={submissions}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
