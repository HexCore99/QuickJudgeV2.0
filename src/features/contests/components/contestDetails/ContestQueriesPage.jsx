import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchContestQueries,
  submitQuery,
} from "../../../contests/contestsThunks";
import { clearQueries } from "../../../contests/contestsSlice";
import {
  selectContestQueries,
  selectContestQueriesLoading,
  selectContestQueriesError,
  selectContestQueriesSubmitting,
  selectContestQueriesSubmitError,
} from "../../../contests/contestsSelectors";
import { CheckCircle, Clock, Send } from "lucide-react";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ContestQueriesPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const queries = useSelector(selectContestQueries);
  const isLoading = useSelector(selectContestQueriesLoading);
  const error = useSelector(selectContestQueriesError);
  const isSubmitting = useSelector(selectContestQueriesSubmitting);
  const submitError = useSelector(selectContestQueriesSubmitError);

  const [question, setQuestion] = useState("");

  useEffect(() => {
    dispatch(fetchContestQueries(contestId));
    return () => {
      dispatch(clearQueries());
    };
  }, [dispatch, contestId]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    dispatch(submitQuery({ contestId, question: trimmed })).then((action) => {
      if (submitQuery.fulfilled.match(action)) {
        setQuestion("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Submit form */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
          <p className="font-semibold text-slate-800">Ask a Question</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Your question will be visible to all participants once submitted.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4">
          <textarea
            id="query-input"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Is the array guaranteed to be sorted in Problem B?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
          {submitError && (
            <p className="mt-2 text-xs text-red-500">{submitError}</p>
          )}
          <div className="mt-3 flex justify-end">
            <button
              id="submit-query-btn"
              type="submit"
              disabled={isSubmitting || !question.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={14} />
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </button>
          </div>
        </form>
      </div>

      {/* Queries list */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-400">
          Loading queries...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
          {error}
        </div>
      ) : !queries.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-400">
          No questions yet. Be the first to ask!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queries.map((q) => (
            <div
              key={q.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              {/* Question */}
              <div className="flex items-start gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {q.username}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">
                      {formatDate(q.createdAt)}
                    </span>
                    <span
                      className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        q.status === "answered"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {q.status === "answered" ? (
                        <CheckCircle size={10} />
                      ) : (
                        <Clock size={10} />
                      )}
                      {q.status === "answered" ? "Answered" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-700">{q.question}</p>
                </div>
              </div>

              {/* Answer */}
              {q.status === "answered" && q.answer && (
                <div className="border-t border-slate-100 bg-emerald-50 px-5 py-3.5">
                  <p className="mb-1 text-[11px] font-semibold tracking-wide text-emerald-600 uppercase">
                    Admin Reply
                  </p>
                  <p className="text-sm text-slate-700">{q.answer}</p>
                  {q.answeredAt && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {formatDate(q.answeredAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContestQueriesPage;
