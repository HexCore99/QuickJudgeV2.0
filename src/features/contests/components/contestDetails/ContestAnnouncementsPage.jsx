import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchContestAnnouncements } from "../../../contests/contestsThunks";
import { clearAnnouncements } from "../../../contests/contestsSlice";
import {
  selectContestAnnouncements,
  selectContestAnnouncementsLoading,
  selectContestAnnouncementsError,
} from "../../../contests/contestsSelectors";
import { markContestItemsSeen } from "../../../contests/contestSeenStorage";
import { Bell } from "lucide-react";

const STUDENT_ANNOUNCEMENTS_SCOPE = "student_announcements";

function formatPostedAt(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ContestAnnouncementsPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const announcements = useSelector(selectContestAnnouncements);
  const isLoading = useSelector(selectContestAnnouncementsLoading);
  const error = useSelector(selectContestAnnouncementsError);

  useEffect(() => {
    dispatch(fetchContestAnnouncements(contestId));
    return () => {
      dispatch(clearAnnouncements());
    };
  }, [dispatch, contestId]);

  useEffect(() => {
    if (announcements.length) {
      markContestItemsSeen(
        STUDENT_ANNOUNCEMENTS_SCOPE,
        contestId,
        announcements,
      );
    }
  }, [announcements, contestId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        Loading announcements...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!announcements.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        No announcements yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          {/* Card header */}
          <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Bell size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800">{ann.title}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Posted · {formatPostedAt(ann.postedAt)}
              </p>
            </div>
          </div>

          {/* Card body */}
          <div className="px-5 py-4">
            <p className="text-sm leading-relaxed text-slate-600">{ann.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContestAnnouncementsPage;
