import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CheckCircle, Clock, Send } from "lucide-react";
import { clearQueries } from "../../contests/contestsSlice";
import {
  selectContestQueries,
  selectContestQueriesError,
  selectContestQueriesLoading,
  selectContestQueriesReplyError,
  selectContestQueriesReplyingId,
} from "../../contests/contestsSelectors";
import {
  fetchContestQueries,
  replyContestQuery,
} from "../../contests/contestsThunks";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminContestQueriesPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const queries = useSelector(selectContestQueries);
  const isLoading = useSelector(selectContestQueriesLoading);
  const error = useSelector(selectContestQueriesError);
  const replyingId = useSelector(selectContestQueriesReplyingId);
  const replyError = useSelector(selectContestQueriesReplyError);

  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    dispatch(fetchContestQueries(contestId));

    return () => {
      dispatch(clearQueries());
    };
  }, [dispatch, contestId]);

  function setDraft(queryId, value) {
    setDrafts((prev) => ({ ...prev, [queryId]: value }));
  }

  async function handleReply(queryId) {
    const answer = (drafts[queryId] || "").trim();

    if (!answer) return;

    const result = await dispatch(
      replyContestQuery({ contestId, queryId, answer }),
    );

    if (replyContestQuery.fulfilled.match(result)) {
      setDrafts((prev) => ({ ...prev, [queryId]: "" }));
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        Loading queries...
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

  if (!queries.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        No participant queries yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {replyError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
          {replyError}
        </div>
      )}

      {queries.map((query) => {
        const draft = drafts[query.id] ?? "";
        const isReplying = replyingId === query.id;

        return (
          <div
            key={query.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {query.username}
                  </span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-400">
                    {formatDate(query.createdAt)}
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      query.status === "answered"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {query.status === "answered" ? (
                      <CheckCircle size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    {query.status === "answered" ? "Answered" : "Pending"}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-700">
                  {query.question}
                </p>
              </div>
            </div>

            {query.answer && (
              <div className="border-b border-slate-100 bg-emerald-50 px-5 py-3.5">
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-emerald-600 uppercase">
                  Current Reply
                </p>
                <p className="text-sm text-slate-700">{query.answer}</p>
                {query.answeredAt && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    {formatDate(query.answeredAt)}
                  </p>
                )}
              </div>
            )}

            <div className="px-5 py-4">
              <textarea
                rows={3}
                value={draft}
                onChange={(e) => setDraft(query.id, e.target.value)}
                placeholder={
                  query.answer ? "Update reply..." : "Write admin reply..."
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleReply(query.id)}
                  disabled={isReplying || !draft.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={14} />
                  {isReplying
                    ? "Sending..."
                    : query.answer
                      ? "Update Reply"
                      : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminContestQueriesPage;
