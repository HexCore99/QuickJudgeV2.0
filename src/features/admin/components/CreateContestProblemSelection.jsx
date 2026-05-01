import { useState } from "react";
import { Search, X } from "lucide-react";

const MOCK_PROBLEMS = [
  { id: 1, title: "Two Sum Variants", difficulty: "Easy", tag: "Array" },
  { id: 2, title: "Shortest Path in Grid", difficulty: "Medium", tag: "Graph" },
  { id: 3, title: "Longest Palindrome DP", difficulty: "Hard", tag: "DP" },
  {
    id: 4,
    title: "Binary Search on Answer",
    difficulty: "Medium",
    tag: "Binary Search",
  },
  {
    id: 5,
    title: "Cycle Detection in Graph",
    difficulty: "Medium",
    tag: "Graph",
  },
];

const inputClasses =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";

function getDifficultyClasses(difficulty) {
  if (difficulty === "Easy") return "text-emerald-600";
  if (difficulty === "Medium") return "text-amber-600";
  return "text-red-600";
}

export default function CreateContestProblemSelection({
  selectedProblems,
  onToggleProblem,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProblems = MOCK_PROBLEMS.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-800">
          Select Problems
        </h2>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
          {selectedProblems.length} Selected
        </span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search problems by name or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${inputClasses} pl-10`}
        />
      </div>

      <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-100">
        {filteredProblems.map((problem) => {
          const isSelected = selectedProblems.some(
            (selected) => selected.id === problem.id,
          );

          return (
            <div
              key={problem.id}
              onClick={() => onToggleProblem(problem)}
              className={`flex cursor-pointer items-center justify-between border-b border-slate-100 p-3.5 transition last:border-0 hover:bg-slate-50 ${
                isSelected ? "bg-amber-50/30" : ""
              }`}
            >
              <div>
                <div className="text-[13.5px] font-semibold text-slate-800">
                  {problem.title}
                </div>
                <div className="mt-1 flex gap-2 text-[11px] font-medium">
                  <span className={getDifficultyClasses(problem.difficulty)}>
                    {problem.difficulty}
                  </span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">{problem.tag}</span>
                </div>
              </div>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                  isSelected
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <X className="h-3.5 w-3.5 rotate-45" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
