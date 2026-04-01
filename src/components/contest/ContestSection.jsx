import ContestListCard from "./ContestListCard";
import ContestSectionTitle from "./ContestSectionTitle";

function ContestSection({ title, icon, contests, type, live = false }) {
  if (!contests.length) return null;

  return (
    <section className="mb-10">
      <ContestSectionTitle title={title} icon={icon} live={live} />

      <div className="grid gap-4 xl:grid-cols-2">
        {contests.map((contest) => (
          <ContestListCard key={contest.id} contest={contest} type={type} />
        ))}
      </div>
    </section>
  );
}

export default ContestSection;
