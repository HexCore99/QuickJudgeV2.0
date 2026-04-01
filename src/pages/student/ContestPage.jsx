import { useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import StudentTopTabs from "../../components/layout/StudentTopTabs";
import ContestPageHeader from "../../components/contest/ContestPageHeader";
import ContestFilterBar from "../../components/contest/ContestFilterBar";
import ContestSection from "../../components/contest/ContestSection";
import PastContestTable from "../../components/contest/PastContestTable";
import {
  contestFilters,
  liveContests,
  pastContests,
  upcomingContests,
} from "../../features/contests/contestsMockData";

function ContestPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [pastFilter, setPastFilter] = useState("all");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const searchMatch = ({ name = "", desc = "", type = "", tags = [] }) => {
    if (!query) return true;

    const haystack = [name, desc, type, ...tags].join(" ").toLowerCase();
    return haystack.includes(query);
  };

  const filteredLive = liveContests.filter(searchMatch);

  const filteredUpcoming = upcomingContests.filter(searchMatch);

  const filteredPast = pastContests.filter((contest) => {
    const matchesRated =
      pastFilter === "all" ||
      (pastFilter === "rated" && contest.rated) ||
      (pastFilter === "unrated" && !contest.rated);

    return matchesRated && searchMatch(contest);
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <StudentTopTabs activeTab="Contests" />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <ContestPageHeader search={search} setSearch={setSearch} />

        <ContestFilterBar
          filters={contestFilters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setPastFilter={setPastFilter}
        />

        {(activeFilter === "all" || activeFilter === "live") && (
          <ContestSection
            title="Live Contests"
            icon={Clock3}
            contests={filteredLive}
            type="live"
            live
          />
        )}

        {(activeFilter === "all" || activeFilter === "upcoming") && (
          <ContestSection
            title="Upcoming Contests"
            icon={CalendarDays}
            contests={filteredUpcoming}
            type="upcoming"
          />
        )}

        {(activeFilter === "all" || activeFilter === "past") && (
          <PastContestTable
            contests={filteredPast}
            pastFilter={pastFilter}
            setPastFilter={setPastFilter}
          />
        )}
      </main>
    </div>
  );
}

export default ContestPage;
