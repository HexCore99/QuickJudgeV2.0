import { useState } from "react";
import { Search, Edit3, CheckCircle2, AlertCircle, Save, X, Video } from "lucide-react";

const MOCK_PROBLEMS = [
  { id: 1, title: "Two Sum Variants",         hasEditorial: true },
  { id: 2, title: "Shortest Path in Grid",    hasEditorial: false },
  { id: 3, title: "Longest Palindrome DP",    hasEditorial: false },
  { id: 4, title: "Binary Search on Answer",  hasEditorial: true },
  { id: 5, title: "Cycle Detection in Graph", hasEditorial: false },
];

export default function AdminEditorialsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  
  const [markdownContent, setMarkdownContent] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [videoLink, setVideoLink] = useState("");

  const filteredProblems = MOCK_PROBLEMS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProblem = (p) => {
    setSelectedProblem(p);
    if (p.hasEditorial) {
      setMarkdownContent("### Intuition\nThe problem can be solved using...");
      setCodeContent("def solve():\n    pass");
      setVideoLink("https://youtube.com/watch?v=example");
    } else {
      setMarkdownContent("");
      setCodeContent("");
      setVideoLink("");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Problem List */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-[700px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            <h2 className="text-[14px] font-bold text-slate-800 mb-3">Select Problem</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-[13px] outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredProblems.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProblem(p)}
                className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition ${
                  selectedProblem?.id === p.id 
                    ? "bg-amber-50 text-amber-700" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="truncate pr-2">{p.title}</span>
                {p.hasEditorial ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Editor */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-[700px]">
          {selectedProblem ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-amber-500" />
                  <h2 className="text-[14px] font-bold text-slate-800">
                    Editing: <span className="text-amber-700 font-semibold">{selectedProblem.title}</span>
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50">
                    <X className="h-3.5 w-3.5" /> Discard
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-amber-700 shadow-sm">
                    <Save className="h-3.5 w-3.5" /> Save Editorial
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">Intuition & Approach (Markdown)</label>
                  <textarea 
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    className="w-full resize-y h-40 rounded-xl border border-slate-200 p-4 text-[13px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 font-mono"
                    placeholder="Write your explanation here..."
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">Optimal Code Solution</label>
                  <textarea 
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="w-full resize-y h-48 rounded-xl border border-slate-800 bg-slate-900 text-emerald-400 p-4 text-[13px] outline-none font-mono"
                    placeholder="Paste optimal code..."
                    spellCheck="false"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">Video Walkthrough URL</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="url"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-[13px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Edit3 className="h-10 w-10 mb-3 text-slate-300" />
              <p className="text-[14px] font-medium">Select a problem from the left to manage its editorial.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
