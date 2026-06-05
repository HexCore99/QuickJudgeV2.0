import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { getProblemBankApi } from "../../../features/problems/problemsApi";
import { DIFFICULTY_BADGE_CLASSES } from "../../../features/problems/problemStyles";

const PAGE_SIZE = 10;
const DEFAULT_PAGINATION = {
  page: 1,
  limit: PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
};

function StudentProblemBankPage() {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProblemBank() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getProblemBankApi({
          page: currentPage,
          limit: PAGE_SIZE,
          search: searchQuery,
          difficulty: filterDifficulty,
          withPagination: true,
        });

        if (isMounted) {
          setProblems(result.items);
          setPagination(result.pagination || DEFAULT_PAGINATION);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch problem bank.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProblemBank();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, filterDifficulty]);

  const totalPages = Math.max(Number(pagination.totalPages) || 1, 1);
  const displayedPage = Number(pagination.page) || currentPage;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (difficulty) => {
    setFilterDifficulty(difficulty);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-[1]">
        <StudentTopTabs />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Problem Bank
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Practice and solve algorithmic challenges at your own pace.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title or tags..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-10 text-[13px] transition outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-[13px] font-medium text-slate-600">
                    Difficulty:
                  </span>
                </div>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => handleDifficultyChange(difficulty)}
                      className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
                        filterDifficulty === difficulty
                          ? "bg-white text-amber-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Problem Title
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Difficulty
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Tags
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Editorial
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        Loading problems...
                      </td>
                    </tr>
                  )}

                  {error && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-[13px] text-red-600"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    !error &&
                    problems.map((problem) => (
                      <tr
                        key={problem.id}
                        className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/student/problems/${problem.id}`}
                            state={{ problem }}
                            className="text-[14px] font-semibold text-slate-800 transition-colors hover:text-amber-700"
                          >
                            {problem.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${DIFFICULTY_BADGE_CLASSES[problem.difficulty]}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {(problem.tags || []).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {problem.hasEditorial ? (
                            <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" /> Available
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
                              <AlertCircle className="h-4 w-4" /> Missing
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                  {!isLoading && !error && problems.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        No problems found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!isLoading && !error && pagination.totalItems > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[12px] font-medium text-slate-500">
                  Showing {problems.length} of {pagination.totalItems} problems
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={displayedPage <= 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(page - 1, 1))
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>
                  <span className="min-w-24 text-center text-[12px] font-semibold text-slate-600">
                    Page {displayedPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={displayedPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(page + 1, totalPages))
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentProblemBankPage;
