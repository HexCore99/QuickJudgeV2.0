import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Code,
  Target,
  Cpu,
  Clock,
  Tag,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

const LOCAL_PROBLEMS_KEY = "qj_admin_problems";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COMMON_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "DFS",
  "BFS",
  "Tree",
  "Binary Search",
  "Graph",
];

const EMPTY_TEST_CASE = { input: "", output: "", isHidden: false };

const initialFormValues = {
  title: "",
  statement: "",
  inputFormat: "",
  outputFormat: "",
  constraints: "",
  points: "100",
  timeLimitSeconds: "1",
  memoryLimitMb: "256",
};

function getStoredProblems() {
  try {
    const savedProblems = localStorage.getItem(LOCAL_PROBLEMS_KEY);
    return savedProblems ? JSON.parse(savedProblems) : [];
  } catch {
    return [];
  }
}

function getLocalProblem(problemId) {
  return getStoredProblems().find((problem) => String(problem.id) === problemId);
}

export default function CreateProblemPage() {
  const { problemId } = useParams();
  const isEditMode = Boolean(problemId);

  const [formValues, setFormValues] = useState(initialFormValues);
  const [difficulty, setDifficulty] = useState("Medium");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [testCases, setTestCases] = useState([EMPTY_TEST_CASE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const allTags = useMemo(() => [...COMMON_TAGS, ...customTags], [customTags]);

  useEffect(() => {
    if (!isEditMode) {
      return undefined;
    }

    setIsLoading(true);
    setError(null);

    try {
      const problem = getLocalProblem(problemId);

      if (!problem) {
        throw new Error("Problem not found in local storage.");
      }

      setFormValues({
        title: problem.title || "",
        statement: problem.statement || "",
        inputFormat: problem.inputFormat || "",
        outputFormat: problem.outputFormat || "",
        constraints: problem.constraints || "",
        points: String(problem.points || 100),
        timeLimitSeconds: String(problem.timeLimitSeconds || 1),
        memoryLimitMb: String(problem.memoryLimitMb || 256),
      });
      setDifficulty(problem.difficulty || "Medium");

      const problemTags = problem.tags || [];
      setSelectedTags(problemTags);
      setCustomTags(problemTags.filter((tag) => !COMMON_TAGS.includes(tag)));
      setTestCases(
        problem.testCases?.length
          ? problem.testCases.map((testCase) => ({
              input: testCase.input || "",
              output: testCase.output || "",
              isHidden: Boolean(testCase.isHidden),
            }))
          : [EMPTY_TEST_CASE],
      );
    } catch (err) {
      setError(err.message || "Failed to load local problem.");
    } finally {
      setIsLoading(false);
    }

    return undefined;
  }, [isEditMode, problemId]);

  const handleFieldChange = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const tag = newTag.trim();

      if (tag && !allTags.includes(tag)) {
        setCustomTags([...customTags, tag]);
        setSelectedTags([...selectedTags, tag]);
      } else if (tag && allTags.includes(tag) && !selectedTags.includes(tag)) {
        setSelectedTags([...selectedTags, tag]);
      }

      setNewTag("");
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, EMPTY_TEST_CASE]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    setTestCases(
      testCases.map((testCase, i) =>
        i === index ? { ...testCase, [field]: value } : testCase,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";
  const textareaClasses =
    "w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-mono text-[13px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="relative z-1">
        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <Link
            to="/admin/problems"
            className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Problem Bank
          </Link>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {isEditMode ? "Edit Problem" : "Create New Problem"}
              </h1>
              <p className="mt-1 text-[14px] text-slate-500">
                Define problem statement, limits, tags, scoring, and test cases.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                className="rounded-xl bg-amber-600 px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                Save Problem
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-[14px] text-slate-500 shadow-sm">
              Loading problem...
            </div>
          ) : (
            <form
              id="problem-form"
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              onSubmit={handleSubmit}
            >
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                    <Code className="h-4 w-4 text-amber-500" />
                    Problem Content
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Problem Title
                      </label>
                      <input
                        type="text"
                        value={formValues.title}
                        onChange={(e) =>
                          handleFieldChange("title", e.target.value)
                        }
                        placeholder="e.g. Find Longest Palindromic Substring"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Problem Statement (Markdown Supported)
                      </label>
                      <textarea
                        rows={8}
                        value={formValues.statement}
                        onChange={(e) =>
                          handleFieldChange("statement", e.target.value)
                        }
                        placeholder="Describe the problem clearly..."
                        className={textareaClasses}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                          Input Format
                        </label>
                        <textarea
                          rows={3}
                          value={formValues.inputFormat}
                          onChange={(e) =>
                            handleFieldChange("inputFormat", e.target.value)
                          }
                          placeholder="Explain how input is structured..."
                          className={textareaClasses}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                          Output Format
                        </label>
                        <textarea
                          rows={3}
                          value={formValues.outputFormat}
                          onChange={(e) =>
                            handleFieldChange("outputFormat", e.target.value)
                          }
                          placeholder="Explain what needs to be printed..."
                          className={textareaClasses}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Constraints
                      </label>
                      <textarea
                        rows={3}
                        value={formValues.constraints}
                        onChange={(e) =>
                          handleFieldChange("constraints", e.target.value)
                        }
                        placeholder="e.g. 1 <= N <= 10^5"
                        className={textareaClasses}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                      <Target className="h-4 w-4 text-emerald-500" />
                      Test Cases
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTestCase}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Case
                    </button>
                  </div>

                  <div className="space-y-4">
                    {testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl border p-4 pt-5 transition-colors ${
                          tc.isHidden
                            ? "border-amber-200 bg-amber-50/40"
                            : "border-slate-100 bg-slate-50/50"
                        }`}
                      >
                        <div className="absolute top-3 right-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleTestCaseChange(
                                idx,
                                "isHidden",
                                !tc.isHidden,
                              )
                            }
                            className={`flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase transition ${
                              tc.isHidden
                                ? "text-amber-600"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                            title="Toggle hidden test case"
                          >
                            {tc.isHidden ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                            {tc.isHidden ? "Hidden" : "Visible"}
                          </button>

                          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                            Case {idx + 1}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-slate-500">
                              Input
                            </label>
                            <textarea
                              rows={3}
                              value={tc.input}
                              onChange={(e) =>
                                handleTestCaseChange(
                                  idx,
                                  "input",
                                  e.target.value,
                                )
                              }
                              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 font-mono text-[13px] transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                              placeholder="Input data"
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-slate-500">
                              Expected Output
                            </label>
                            <textarea
                              rows={3}
                              value={tc.output}
                              onChange={(e) =>
                                handleTestCaseChange(
                                  idx,
                                  "output",
                                  e.target.value,
                                )
                              }
                              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 font-mono text-[13px] transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                              placeholder="Expected output"
                            />
                          </div>
                        </div>

                        {testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase(idx)}
                            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-red-500 transition hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-[14px] font-semibold text-slate-800">
                    Scoring & Difficulty
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        Points
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formValues.points}
                        onChange={(e) =>
                          handleFieldChange("points", e.target.value)
                        }
                        className={inputClasses}
                        placeholder="e.g. 100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Difficulty Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {DIFFICULTIES.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDifficulty(d)}
                            className={`rounded-xl border py-2.5 text-[13px] font-medium transition ${
                              difficulty === d
                                ? d === "Easy"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : d === "Medium"
                                    ? "border-amber-500 bg-amber-50 text-amber-700"
                                    : "border-red-500 bg-red-50 text-red-700"
                                : "border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-1.5 text-[14px] font-semibold text-slate-800">
                    <Tag className="h-4 w-4 text-blue-500" />
                    Topic Tags
                  </div>

                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Create a new tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddNewTag}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-[13px] transition outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewTag}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                            isSelected
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-[14px] font-semibold text-slate-800">
                    Execution Limits
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Time Limit
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={formValues.timeLimitSeconds}
                          onChange={(e) =>
                            handleFieldChange(
                              "timeLimitSeconds",
                              e.target.value,
                            )
                          }
                          className={`${inputClasses} pr-10`}
                        />
                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[13px] text-slate-400">
                          sec
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                        <Cpu className="h-3.5 w-3.5 text-slate-400" />
                        Memory Limit
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          value={formValues.memoryLimitMb}
                          onChange={(e) =>
                            handleFieldChange("memoryLimitMb", e.target.value)
                          }
                          className={`${inputClasses} pr-12`}
                        />
                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[13px] text-slate-400">
                          MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
