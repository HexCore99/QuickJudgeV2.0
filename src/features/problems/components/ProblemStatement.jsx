import { useState } from "react";
import { BookOpen, Check, Copy, FileText, History } from "lucide-react";
import TagChip from "../../../components/common/TagChip";
import ProblemDifficultyBadge from "./ProblemDifficultyBadge";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      title="Copy"
    >
      {copied ? (
        <Check size={14} className="text-emerald-500" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}

function SampleBlock({ index, input, output }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Sample {index + 1}
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-1.5">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Input
            </span>
            <CopyButton text={input} />
          </div>
          <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6 text-slate-700">
            {input}
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-1.5">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Output
            </span>
            <CopyButton text={output} />
          </div>
          <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6 text-slate-700">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}

function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

const LEFT_TABS = [
  { key: "description", label: "Description", icon: FileText },
  { key: "submissions", label: "Submissions", icon: History },
  { key: "editorial", label: "Editorial", icon: BookOpen },
];

const MOCK_SUBMISSIONS = [
  {
    id: 1,
    time: "2 minutes ago",
    language: "C++",
    verdict: "Accepted",
    runtime: "12ms",
    memory: "3.8 MB",
  },
  {
    id: 2,
    time: "15 minutes ago",
    language: "C++",
    verdict: "Wrong Answer",
    runtime: "8ms",
    memory: "3.6 MB",
  },
  {
    id: 3,
    time: "1 hour ago",
    language: "Python",
    verdict: "Time Limit Exceeded",
    runtime: "> 1000ms",
    memory: "12.4 MB",
  },
];

const VERDICT_COLORS = {
  Accepted: "text-emerald-600",
  "Wrong Answer": "text-rose-600",
  "Time Limit Exceeded": "text-amber-600",
  "Runtime Error": "text-orange-600",
  "Compilation Error": "text-red-600",
};

function DescriptionContent({ problem }) {
  return (
    <div className="px-5 py-6 sm:px-7">
      <div className="mb-1 flex flex-wrap items-center justify-center gap-3">
        <h1 className="text-center text-2xl font-black tracking-tight text-slate-900">
          {problem.id}. {problem.title}
        </h1>
        <ProblemDifficultyBadge difficulty={problem.difficulty} />
      </div>

      <div className="mb-7 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <span>Time Limit: {problem.timeLimit}</span>
        <span className="hidden text-slate-200 sm:inline">|</span>
        <span>Memory Limit: {problem.memoryLimit}</span>
      </div>

      <div className="mb-6 text-[14px] leading-7 text-slate-600">
        {problem.description.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-3">
            {renderText(paragraph)}
          </p>
        ))}
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-bold text-slate-800">Input</h2>
        <div className="text-[14px] leading-7 text-slate-600">
          {problem.inputSpec.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-2">
              {renderText(paragraph)}
            </p>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-bold text-slate-800">Output</h2>
        <div className="text-[14px] leading-7 text-slate-600">
          {problem.outputSpec.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-2">
              {renderText(paragraph)}
            </p>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-1 text-base font-bold text-slate-800">Examples</h2>
        {problem.samples.map((sample, index) => (
          <SampleBlock
            key={`${problem.id}-${index}`}
            index={index}
            input={sample.input}
            output={sample.output}
          />
        ))}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-bold text-slate-800">Constraints</h2>
        <ul className="space-y-1.5">
          {problem.constraints.map((constraint, index) => (
            <li
              key={`${problem.id}-constraint-${index}`}
              className="flex items-start gap-2 text-[14px] text-slate-600"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {constraint}
            </li>
          ))}
        </ul>
      </section>

      {problem.tags && problem.tags.length > 0 && (
        <section>
          <h2 className="mb-2 text-base font-bold text-slate-800">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SubmissionsContent() {
  return (
    <div className="px-5 py-6 sm:px-7">
      <h2 className="mb-4 text-lg font-bold text-slate-800">My Submissions</h2>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[1.2fr_1fr_1.4fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Time</span>
          <span>Language</span>
          <span>Verdict</span>
          <span>Runtime</span>
          <span>Memory</span>
        </div>

        {MOCK_SUBMISSIONS.map((submission) => (
          <div
            key={submission.id}
            className="grid grid-cols-[1.2fr_1fr_1.4fr_1fr_1fr] border-b border-slate-100 px-4 py-3 text-[13px] transition last:border-b-0 hover:bg-slate-50/60"
          >
            <span className="text-slate-500">{submission.time}</span>
            <span className="font-medium text-slate-700">
              {submission.language}
            </span>
            <span
              className={`font-semibold ${VERDICT_COLORS[submission.verdict] || "text-slate-600"}`}
            >
              {submission.verdict}
            </span>
            <span className="font-mono text-slate-500">
              {submission.runtime}
            </span>
            <span className="font-mono text-slate-500">
              {submission.memory}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialContent({ hasEditorial }) {
  if (hasEditorial) {
    return (
      <div className="px-5 py-6 sm:px-7">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Editorial</h2>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-6 py-6 text-[14px] leading-7 text-slate-600">
          <p>
            Start by observing the useful invariant hidden in the statement, then
            reduce the search space using a hash-based lookup or greedy state
            transition depending on the language you prefer.
          </p>
          <p>
            The intended solution maintains the minimal amount of information
            needed to answer each step in linear or near-linear time, which keeps
            it within the provided limits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 sm:px-7">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Editorial</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-8 text-center">
        <BookOpen size={40} className="mx-auto mb-3 text-slate-300" />
        <p className="text-[14px] font-medium text-slate-500">
          Editorial is not available yet for this problem.
        </p>
        <p className="mt-1 text-[13px] text-slate-400">
          This view is wired and ready for real content later.
        </p>
      </div>
    </div>
  );
}

function ProblemStatement({ problem }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center gap-0 border-b border-slate-200 bg-slate-50/80 px-4">
        {LEFT_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition ${
                isActive
                  ? "text-amber-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === "description" && <DescriptionContent problem={problem} />}
        {activeTab === "submissions" && <SubmissionsContent />}
        {activeTab === "editorial" && (
          <EditorialContent hasEditorial={problem.hasEditorial} />
        )}
      </div>
    </div>
  );
}

export default ProblemStatement;
