import { useEffect } from "react";
import { Bell, Pin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  selectContestAnnouncements,
  selectContestAnnouncementsError,
  selectContestAnnouncementsLoading,
} from "../../contestsSelectors";
import { fetchContestAnnouncements } from "../../contestsThunks";

function ContestAnnouncementsPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const announcements = useSelector(selectContestAnnouncements);
  const isLoading = useSelector(selectContestAnnouncementsLoading);
  const error = useSelector(selectContestAnnouncementsError);

  useEffect(() => {
    dispatch(fetchContestAnnouncements(contestId));
  }, [dispatch, contestId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Loading announcements...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!announcements.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        No announcements have been posted for this contest yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell size={16} className="text-amber-600" />
        <h2 className="text-sm font-semibold text-slate-700">
          Contest Announcements
        </h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
          {announcements.length}
        </span>
      </div>

      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {announcement.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                <Pin size={12} />
                Pinned
              </span>
            )}

            <span className="text-xs font-medium text-slate-400">
              {announcement.postedAt}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">
            {announcement.title}
          </h3>

          <p className="mt-2 text-sm leading-6 whitespace-pre-line text-slate-600">
            {announcement.message}
          </p>
        </article>
      ))}
    </div>
  );
}

export default ContestAnnouncementsPage;
