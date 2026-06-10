import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageSquare } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import DiscussionList from "../../../features/discussions/components/DiscussionList";
import DiscussionDetail from "../../../features/discussions/components/DiscussionDetail";
import CreateDiscussionForm from "../../../features/discussions/components/CreateDiscussionForm";
import EmptyState from "../../../features/discussions/components/EmptyState";
import {
  selectDiscussionsError,
  selectDiscussionsLoading,
  selectMode,
} from "../../../features/discussions/discussionsSelectors";
import { startCreating } from "../../../features/discussions/discussionsSlice";
import { fetchDiscussions } from "../../../features/discussions/discussionsThunks";

export default function DiscussionPage() {
  const dispatch = useDispatch();
  const mode = useSelector(selectMode);
  const isLoading = useSelector(selectDiscussionsLoading);
  const error = useSelector(selectDiscussionsError);

  useEffect(() => {
    dispatch(fetchDiscussions());
  }, [dispatch]);

  function renderRightPanel() {
    switch (mode) {
      case "creating":
        return <CreateDiscussionForm />;
      case "viewing":
        return <DiscussionDetail />;
      default:
        return <EmptyState onCreateClick={() => dispatch(startCreating())} />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <StudentTopTabs
        tabs={[
          { key: "Problems", to: "/student/problems" },
          { key: "Contests", to: "/student/contests" },
          { key: "Leaderboard", to: "/student/leaderboard" },
          { key: "Discuss", to: "/student/discuss" },
        ]}
        logoTo="/"
      />

      <main className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
        {/* Hero */}
        <section className="mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/70 text-amber-700 shadow-sm">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-[48px] leading-none font-bold tracking-[-0.04em] text-slate-800 md:text-[56px]">
                Discussions
              </h1>
              <p className="mt-1.5 text-[14px] font-medium tracking-[0.01em] text-slate-500 md:text-[15px]">
                Join or start a conversation with the community
              </p>
            </div>
          </div>
        </section>

        {/* Split Panel */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex min-h-[620px] flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* Left — Discussion List */}
          <div className="w-[360px] shrink-0 border-r border-slate-200/80 bg-slate-50/60 xl:w-[400px] 2xl:w-[430px]">
            <DiscussionList isLoading={isLoading} />
          </div>

          {/* Right — Detail / Create / Empty */}
          <div className="flex min-w-0 flex-1 flex-col">
            {renderRightPanel()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/7 py-5">
        <div className="flex w-full flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:px-6 md:flex-row lg:px-8 2xl:px-10">
          <span>QuickJudge V2.0 — Built for competitive learners</span>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-slate-800">
              Documentation
            </a>
            <a href="#" className="transition-colors hover:text-slate-800">
              API
            </a>
            <a href="#" className="transition-colors hover:text-slate-800">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
