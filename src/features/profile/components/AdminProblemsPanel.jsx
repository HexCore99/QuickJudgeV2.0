import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Edit2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

const CURRENT_USER = { id: 101, role: "admin", name: "Siyam" }; 

const MOCK_PROBLEMS = [
  { id: 1, title: "Two Sum Variants",         difficulty: "Easy",   tags: ["Array", "Hash Table"], hasEditorial: true,  authorId: 101 },
  { id: 2, title: "Shortest Path in Grid",    difficulty: "Medium", tags: ["Graph", "BFS"],        hasEditorial: false, authorId: 102 },
  { id: 3, title: "Longest Palindrome DP",    difficulty: "Hard",   tags: ["DP", "String"],        hasEditorial: false, authorId: 101 },
  { id: 5, title: "Cycle Detection in Graph", difficulty: "Medium", tags: ["Graph", "DFS"],        hasEditorial: false, authorId: 101 },
  { id: 7, title: "Maximum Subarray Sum",     difficulty: "Easy",   tags: ["Array", "DP"],         hasEditorial: true,  authorId: 101 },
];

const diffStyles = {
  Easy:   "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50   text-amber-700",
  Hard:   "bg-red-50     text-red-600",
};

export default function AdminProblemsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const myProblems = MOCK_PROBLEMS.filter(p => p.authorId === CURRENT_USER.id);

  const filteredProblems = myProblems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = filterDifficulty === "All" || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your problems..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-[13px] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-[13px] font-medium text-slate-600">Difficulty:</span>
            </div>
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
                    filterDifficulty === diff ? "bg-white text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Problem Title</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Difficulty</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tags</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Editorial</th>
                <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0">
                  <td className="px-6 py-4">
                    <Link to={`/admin/problems/${p.id}`} className="text-[14px] font-semibold text-slate-800 hover:text-amber-700 transition-colors">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${diffStyles[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {p.hasEditorial ? (
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
                        <AlertCircle className="h-4 w-4" /> Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700">
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[13px] text-slate-500">
                    You haven't created any problems yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
