import Editor from "@monaco-editor/react";
import { X, Copy } from "lucide-react";

const verdictLabels = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  RE: "Runtime Error",
  CE: "Compilation Error",
};

const diffColors = {
  Hard: "text-red-600",
  Medium: "text-amber-500",
  Easy: "text-green-600",
};

const verdictBg = {
  ac: "bg-green-600/8 text-green-600",
  wa: "bg-red-600/8 text-red-600",
  tle: "bg-amber-500/8 text-amber-500",
  re: "bg-red-600/5 text-red-700",
  ce: "bg-slate-500/8 text-slate-600",
};

const languageMap = {
  "C++": "cpp",
  Python: "python",
  Java: "java",
};

function getEditorLanguage(lang) {
  return languageMap[lang] || "plaintext";
}

export default function SubmissionSlidePanel({
  submission,
  isOpen,
  onClose,
  onToast,
}) {
  const s = submission;

  function handleCopy() {
    if (!s) return;
    navigator.clipboard
      .writeText(s.code)
      .then(() => onToast("Code copied", "success"))
      .catch(() => onToast("Failed to copy", "error"));
  }

  const rows = s
    ? [
        { label: "Difficulty", value: s.diff, cls: diffColors[s.diff] },
        { label: "Language", value: s.lang, mono: true },
        { label: "Execution Time", value: s.time, mono: true },
        { label: "Memory Used", value: s.mem, mono: true },
        { label: "Submitted", value: s.at, mono: true },
        ...(s.contest
          ? [{ label: "Contest", value: s.contest, cls: "text-amber-600" }]
          : []),
      ]
    : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[940] bg-black/30 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Floating panel */}
      <div
        className={`fixed top-1/2 left-1/2 z-[950] max-h-[calc(100vh-2rem)] w-[860px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-amber-600/20 bg-white shadow-2xl transition-all duration-300 ${
          isOpen
            ? "-translate-y-1/2 scale-100 opacity-100"
            : "pointer-events-none -translate-y-[45%] scale-95 opacity-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {s && (
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                Submission Details
              </h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Verdict + problem name */}
            <div className="mb-5">
              <div className="mb-1 flex items-center gap-3">
                <span
                  className={`rounded-md px-3.5 py-1.5 font-mono text-[13px] font-semibold tracking-wide ${
                    verdictBg[s.verdict.toLowerCase()] || verdictBg.ce
                  }`}
                >
                  {s.verdict}
                </span>
                <span className="text-xs text-slate-500">
                  {verdictLabels[s.verdict] || s.verdict}
                </span>
              </div>
              <h4 className="mt-3 text-xl font-bold text-slate-800">
                {s.problem}
              </h4>
              {/* <p className="mt-1 font-mono text-xs text-slate-400">{s.id}</p> */}
            </div>

            {/* Detail rows */}
            <div className="mb-5 rounded-xl border border-black/7 bg-slate-50 p-4">
              {rows.map((r, i) => (
                <div
                  key={r.label}
                  className={`flex justify-between py-2.5 ${
                    i < rows.length - 1 ? "border-b border-black/7" : ""
                  }`}
                >
                  <span className="text-xs text-slate-500">{r.label}</span>
                  <span
                    className={`text-xs font-medium ${r.mono ? "font-mono" : ""} ${r.cls || "text-slate-800"}`}
                  >
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Test cases */}
            <div className="mb-5">
              <h5 className="mb-3 text-sm font-semibold text-slate-800">
                Test Cases
              </h5>
              <div className="rounded-xl border border-black/7 bg-slate-50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-500">
                {s.tc}
              </div>
            </div>

            {/* Source code */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h5 className="text-sm font-semibold text-slate-800">
                  Source Code
                </h5>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-600/20 px-3 py-1.5 text-[11px] text-amber-600 transition-colors hover:bg-slate-50"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/6 bg-slate-800">
                <Editor
                  height="500px"
                  language={getEditorLanguage(s.lang)}
                  value={s.code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    fontFamily: "Consolas, 'Courier New', monospace",
                    lineNumbers: "on",
                    wordWrap: "off",
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
