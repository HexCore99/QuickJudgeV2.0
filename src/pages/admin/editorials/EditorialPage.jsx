import { useEffect, useMemo, useState } from "react";
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


// Mock Problems
const MOCK_PROBLEMS = [
  { id: 1, title: "Two Sum", hasEditorial: true },
  { id: 2, title: "Longest Substring Without Repeating Characters", hasEditorial: false },
  { id: 3, title: "Binary Search", hasEditorial: true },
  { id: 4, title: "Merge Intervals", hasEditorial: false },
];

// Mock Editorials
const MOCK_EDITORIALS = {
  1: {
    markdownContent: "## Intuition\nUse a hashmap to store visited numbers.",
    codeContent: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
}`,
    videoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  },
  3: {
    markdownContent: "## Binary Search\nDivide and conquer approach.",
    codeContent: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    videoLink: "",
  },
};



useEffect(() => {


  setTimeout(() => {
    setProblems(MOCK_PROBLEMS);
    setIsLoadingProblems(false);
  }, 500); // simulate API delay
}, []);

  const filteredProblems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(normalizedQuery),
    );
  }, [problems, searchQuery]);

const handleSelectProblem = async (problem) => {
  setSelectedProblem(problem);
  setMarkdownContent("");
  setCodeContent("");
  setVideoLink("");
  setError(null);
  setSuccessMessage(null);
  setIsLoadingEditorial(true);

  setTimeout(() => {
    const editorial = MOCK_EDITORIALS[problem.id];

    if (editorial) {
      setMarkdownContent(editorial.markdownContent);
      setCodeContent(editorial.codeContent);
      setVideoLink(editorial.videoLink);
    } else {
      setMarkdownContent("");
      setCodeContent("");
      setVideoLink("");
    }

    setIsLoadingEditorial(false);
  }, 400);
};

  const handleDiscard = () => {
    if (selectedProblem) {
      handleSelectProblem(selectedProblem);
    }
  };

const handleSaveEditorial = async () => {
  if (!selectedProblem) return;

  setIsSaving(true);
  setError(null);
  setSuccessMessage(null);

  setTimeout(() => {
    // Save into mock object
    MOCK_EDITORIALS[selectedProblem.id] = {
      markdownContent,
      codeContent,
      videoLink,
    };

    // Update UI state
    setProblems((current) =>
      current.map((p) =>
        p.id === selectedProblem.id ? { ...p, hasEditorial: true } : p
      )
    );

    setSelectedProblem((current) =>
      current ? { ...current, hasEditorial: true } : current
    );

    setSuccessMessage("Editorial saved (mock).");
    setIsSaving(false);
  }, 600);
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-1">
        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <div className="mb-8">
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex h-[700px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-1">
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

            <div className="flex h-[700px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
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
                          <textarea
                            value={markdownContent}
                            onChange={(e) => setMarkdownContent(e.target.value)}
                            className="h-40 w-full resize-y rounded-xl border border-slate-200 p-4 font-mono text-[13px] transition outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                            placeholder="Write your explanation here..."
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                            Optimal Code Solution
                          </label>
                          <textarea
                            value={codeContent}
                            onChange={(e) => setCodeContent(e.target.value)}
                            className="h-48 w-full resize-y rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-[13px] text-emerald-400 outline-none"
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
