import { createElement, useEffect, useState } from "react";
import { Bell, BarChart3, FileText, HelpCircle, Send } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { getContestAnnouncementsApi } from "../../../contests/contestsApi";
import {
  CONTEST_SEEN_CHANGE_EVENT,
  hasUnseenContestItems,
} from "../../../contests/contestSeenStorage";

const CONTEST_TABS = [
  { label: "Problems", key: "problems", icon: FileText },
  { label: "Submissions", key: "submissions", icon: Send },
  { label: "Leaderboard", key: "leaderboard", icon: BarChart3 },
  { label: "Announcements", key: "announcements", icon: Bell },
  { label: "Queries", key: "queries", icon: HelpCircle },
];

const STUDENT_ANNOUNCEMENTS_SCOPE = "student_announcements";

function ContestTabs() {
  const { contestId } = useParams();
  const [announcements, setAnnouncements] = useState([]);
  const [hasUnreadAnnouncements, setHasUnreadAnnouncements] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadAnnouncementIndicator() {
      try {
        const items = await getContestAnnouncementsApi(contestId);

        if (!isCancelled) {
          setAnnouncements(items);
          setHasUnreadAnnouncements(
            hasUnseenContestItems(
              STUDENT_ANNOUNCEMENTS_SCOPE,
              contestId,
              items,
            ),
          );
        }
      } catch {
        if (!isCancelled) {
          setAnnouncements([]);
          setHasUnreadAnnouncements(false);
        }
      }
    }

    loadAnnouncementIndicator();

    return () => {
      isCancelled = true;
    };
  }, [contestId]);

  useEffect(() => {
    function refreshIndicator(event) {
      const isMatchingEvent =
        event.type === "storage" ||
        (event.detail?.scope === STUDENT_ANNOUNCEMENTS_SCOPE &&
          event.detail?.contestId === contestId);

      if (isMatchingEvent) {
        setHasUnreadAnnouncements(
          hasUnseenContestItems(
            STUDENT_ANNOUNCEMENTS_SCOPE,
            contestId,
            announcements,
          ),
        );
      }
    }

    window.addEventListener(CONTEST_SEEN_CHANGE_EVENT, refreshIndicator);
    window.addEventListener("storage", refreshIndicator);

    return () => {
      window.removeEventListener(CONTEST_SEEN_CHANGE_EVENT, refreshIndicator);
      window.removeEventListener("storage", refreshIndicator);
    };
  }, [announcements, contestId]);

  return (
    <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-slate-200/60 p-2 text-sm">
      {CONTEST_TABS.map(({ label, key, icon }) => (
        <NavLink
          key={key}
          to={`/student/contests/${contestId}/${key}`}
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-lg px-4 py-2 transition ${
              isActive
                ? "bg-white font-semibold text-slate-900 shadow-sm"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
            }`
          }
        >
          {createElement(icon, { size: 16 })}
          {label}
          {key === "announcements" && hasUnreadAnnouncements && (
            <span
              className="h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
              aria-label="New announcements"
            />
          )}
        </NavLink>
      ))}
    </div>
  );
}

export default ContestTabs;
