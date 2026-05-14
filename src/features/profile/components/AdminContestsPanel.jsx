import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Edit2, Trash2, Users, FileText } from "lucide-react";

const CURRENT_USER = { id: 101, role: "admin", name: "Siyam" }; 

const MOCK_CONTESTS = [
  { id: 1, title: "Weekly Algo Sprint #14",    status: "Running",  participants: 142, problems: 5, date: "Apr 17, 2026", authorId: 101 },
  { id: 3, title: "DP Mastery Challenge",      status: "Upcoming", participants: 0,   problems: 6, date: "Apr 19, 2026", authorId: 101 },
];

const statusStyles = {
  Running:  "bg-emerald-50 text-emerald-700",
  Upcoming: "bg-blue-50   text-blue-700",
  Ended:    "bg-slate-100 text-slate-500",
  Draft:    "bg-amber-50  text-amber-700",
};

export default function AdminContestsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const myContests = MOCK_CONTESTS.filter(c => c.authorId === CURRENT_USER.id);

  const filteredContests = myContests.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your contests..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-[13px] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-[13px] font-medium text-slate-600">Status:</span>
            </div>
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {["All", "Running", "Upcoming", "Ended"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
                    filterStatus === status ? "bg-white text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Contest Title</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Participants</th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Problems</th>
                <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContests.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0">
                  <td className="px-6 py-4">
                    <Link to={`/admin/contests/${c.id}`} className="text-[14px] font-semibold text-slate-800 hover:text-amber-700 transition-colors">
                      {c.title}
                    </Link>
                    <div className="mt-1 text-[12px] text-slate-400">{c.date}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                      <Users className="h-4 w-4 text-slate-400" /> {c.participants}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                      <FileText className="h-4 w-4 text-slate-400" /> {c.problems}
                    </div>
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
              {filteredContests.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[13px] text-slate-500">
                    You haven't created any contests matching these filters.
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
