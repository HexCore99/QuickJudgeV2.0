import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import DiscussionDetails from "../../../features/discussion/components/DiscussionDetails";
import DiscussionForm from "../../../features/discussion/components/DiscussionForm";
import DiscussionList from "../../../features/discussion/components/DiscussionList";
import EmptyState from "../../../features/discussion/components/EmptyState";
import {
  selectActiveDiscussion,
  selectDiscussionError,
  selectDiscussionHasFetched,
  selectDiscussionIsCreating,
  selectDiscussionLoading,
} from "../../../features/discussion/discussionSelectors";
import { startCreating } from "../../../features/discussion/discussionSlice";
import { fetchDiscussions } from "../../../features/discussion/discussionThunks";

export default function DiscussionPage() {
  const dispatch = useDispatch();
  const activeDiscussion = useSelector(selectActiveDiscussion);
  const isCreating = useSelector(selectDiscussionIsCreating);
  const isLoading = useSelector(selectDiscussionLoading);
  const hasFetched = useSelector(selectDiscussionHasFetched);
  const error = useSelector(selectDiscussionError);

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      dispatch(fetchDiscussions());
    }
  }, [dispatch, hasFetched, isLoading]);

  let content = <EmptyState onCreateClick={() => dispatch(startCreating())} />;

  if (isLoading && !hasFetched) {
    content = (
      <div className="flex h-full items-center justify-center px-8 py-20 text-sm text-slate-400">
        Loading discussions...
      </div>
    );
  } else if (isCreating) {
    content = <DiscussionForm />;
  } else if (activeDiscussion) {
    content = <DiscussionDetails />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StudentTopTabs logoTo="/" />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-7 flex items-start gap-3">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/70 text-amber-700 shadow-sm">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-[42px] leading-none font-bold tracking-tight text-slate-800 md:text-[52px]">
              Discussion
            </h1>
            <p className="mt-1.5 text-[14px] font-medium text-slate-500 md:text-[15px]">
              Ask questions, compare approaches, and help the community learn.
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:h-[calc(100vh-205px)] lg:min-h-[620px] lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="min-h-[360px] border-b border-slate-200 bg-white lg:min-h-0 lg:border-r lg:border-b-0">
            <DiscussionList />
          </aside>

          <div className="min-h-[520px] bg-white lg:min-h-0">{content}</div>
        </section>
      </main>
    </div>
  );
}
