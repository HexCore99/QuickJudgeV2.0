import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import {
  Search,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Video,
} from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import {
  getMyProblemsApi,
  getProblemEditorialApi,
  saveProblemEditorialApi,
} from "../../../features/problems/problemsApi";

const markdownPreviewClasses =
  "space-y-3 text-[13px] leading-6 text-slate-700 [&_a]:font-medium [&_a]:text-amber-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:bg-white [&_blockquote]:py-2 [&_blockquote]:pr-3 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_hr]:border-slate-200 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-emerald-300 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-white [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5";

export default function EditorialsPage() {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  const [isLoadingEditorial, setIsLoadingEditorial] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadProblems() {
      setIsLoadingProblems(true);
      setError(null);

      try {
        const items = await getMyProblemsApi();

        if (!isCancelled) {
          setProblems(items);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || "Failed to load problems.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProblems(false);
        }
      }
    }

    loadProblems();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredProblems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(normalizedQuery),
    );
  }, [problems, searchQuery]);

  const markdownPreviewHtml = useMemo(() => {
    const renderedMarkdown = marked.parse(markdownContent, {
      breaks: true,
      gfm: true,
    });

    return DOMPurify.sanitize(renderedMarkdown);
  }, [markdownContent]);

  const handleSelectProblem = async (problem) => {
    setSelectedProblem(problem);
    setMarkdownContent("");
    setCodeContent("");
    setVideoLink("");
    setError(null);
    setSuccessMessage(null);
    setIsLoadingEditorial(true);

    try {
      const editorial = await getProblemEditorialApi(problem.id);
      setMarkdownContent(editorial.markdownContent || "");
      setCodeContent(editorial.codeContent || "");
      setVideoLink(editorial.videoLink || "");
    } catch (err) {
      setError(err.message || "Failed to load editorial.");
    } finally {
      setIsLoadingEditorial(false);
    }
  };

  const handleDiscard = () => {
    if (selectedProblem) {
      handleSelectProblem(selectedProblem);
    }
  };

  const handleSaveEditorial = async () => {
    if (!selectedProblem) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await saveProblemEditorialApi(selectedProblem.id, {
        markdownContent,
        codeContent,
        videoLink,
      });

      setProblems((current) =>
        current.map((problem) =>
          problem.id === selectedProblem.id
            ? { ...problem, hasEditorial: true }
            : problem,
        ),
      );
      setSelectedProblem((current) =>
        current ? { ...current, hasEditorial: true } : current,
      );
      setSuccessMessage("Editorial saved.");
    } catch (err) {
      setError(err.message || "Failed to save editorial.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={getCurrentAdminNavTabs()}
          logoTo="/"
          navExtra={<AdminMoreMenu />}
        />

        <main className="w-full px-4 py-6 pb-10 sm:px-6 lg:px-8 2xl:px-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Manage Editorials
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Write markdown solutions, provide optimal code, and link video
              walkthroughs.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="flex h-[calc(100vh-11rem)] min-h-[720px] min-w-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="rounded-t-2xl border-b border-slate-100 bg-slate-50/50 p-4">
                <h2 className="mb-3 text-[14px] font-bold text-slate-800">
                  Select Problem
                </h2>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-[13px] transition outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {isLoadingProblems && (
                  <div className="px-3 py-8 text-center text-[13px] text-slate-500">
                    Loading problems...
                  </div>
                )}

                {!isLoadingProblems &&
                  filteredProblems.map((problem) => (
                    <button
                      key={problem.id}
                      onClick={() => handleSelectProblem(problem)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${
                        selectedProblem?.id === problem.id
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-2">{problem.title}</span>
                      {problem.hasEditorial ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                      )}
                    </button>
                  ))}

                {!isLoadingProblems && filteredProblems.length === 0 && (
                  <div className="px-3 py-8 text-center text-[13px] text-slate-500">
                    No problems found.
                  </div>
                )}
              </div>
            </div>

            <div className="flex h-[calc(100vh-11rem)] min-h-[720px] min-w-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
              {selectedProblem ? (
                <>
                  <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4 text-amber-500" />
                      <h2 className="text-[14px] font-bold text-slate-800">
                        Editing:{" "}
                        <span className="font-semibold text-amber-700">
                          {selectedProblem.title}
                        </span>
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDiscard}
                        disabled={isLoadingEditorial || isSaving}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X className="h-3.5 w-3.5" /> Discard
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEditorial}
                        disabled={isLoadingEditorial || isSaving}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-1.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {isSaving ? "Saving..." : "Save Editorial"}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-5 overflow-y-auto p-5">
                    {isLoadingEditorial ? (
                      <div className="py-20 text-center text-[13px] text-slate-500">
                        Loading editorial...
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                            Intuition & Approach (Markdown)
                          </label>
                          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
                            <div>
                              <div className="mb-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                                Editor
                              </div>
                              <textarea
                                value={markdownContent}
                                onChange={(e) =>
                                  setMarkdownContent(e.target.value)
                                }
                                className="h-80 w-full resize-y rounded-xl border border-slate-200 p-4 font-mono text-[13px] transition outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                                placeholder="Write your explanation here..."
                              />
                            </div>

                            <div>
                              <div className="mb-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                                Preview
                              </div>
                              <div className="h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                                {markdownContent.trim() ? (
                                  <div
                                    className={markdownPreviewClasses}
                                    dangerouslySetInnerHTML={{
                                      __html: markdownPreviewHtml,
                                    }}
                                  />
                                ) : (
                                  <p className="text-[13px] text-slate-400">
                                    No markdown content yet.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                            Optimal Code Solution
                          </label>
                          <textarea
                            value={codeContent}
                            onChange={(e) => setCodeContent(e.target.value)}
                            className="h-56 w-full resize-y rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-[13px] text-emerald-400 outline-none"
                            placeholder="Paste optimal code..."
                            spellCheck="false"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                            Video Walkthrough URL
                          </label>
                          <div className="relative">
                            <Video className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              type="url"
                              value={videoLink}
                              onChange={(e) => setVideoLink(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 py-2.5 pr-4 pl-9 text-[13px] transition outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                              placeholder="https://youtube.com/watch?v=..."
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
                  <Edit3 className="mb-3 h-10 w-10 text-slate-300" />
                  <p className="text-[14px] font-medium">
                    Select a problem from the left to manage its editorial.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
