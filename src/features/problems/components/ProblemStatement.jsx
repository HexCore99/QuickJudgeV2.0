import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import {
  BookOpen,
  Check,
  Copy,
  FileText,
  History,
  Loader2,
} from "lucide-react";
import TagChip from "../../../components/common/TagChip";
import SubmissionSlidePanel from "../../profile/components/SubmissionSlidePanel";
import SubmissionsPanel from "../../profile/components/SubmissionsPanel";
import { getProblemSubmissionsApi } from "../../submissions/submissionsApi";
import ProblemDifficultyBadge from "./ProblemDifficultyBadge";

function CopyButton({ text, tone = "light" }) {
  const [copied, setCopied] = useState(false);
  const buttonClasses =
    tone === "dark"
      ? "rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
      : "rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600";

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
      className={buttonClasses}
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
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Sample {index + 1}
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
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
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
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

const editorialMarkdownClasses =
  "space-y-3 text-[14px] leading-7 text-slate-600 [&_a]:font-medium [&_a]:text-amber-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:bg-white [&_blockquote]:py-2 [&_blockquote]:pr-3 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_hr]:border-slate-200 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-emerald-300 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-white [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5";

function isPositiveInteger(value) {
  const numberValue = Number(value);

  return Number.isInteger(numberValue) && numberValue > 0;
}

function getProblemSubmissionId(problem) {
  const candidate = problem?.problemBankId || problem?.problemId || problem?.id;

  return isPositiveInteger(candidate) ? Number(candidate) : null;
}

function getContestProblemCode(problem, contestId) {
  if (!contestId) {
    return null;
  }

  return problem?.contestProblemCode || problem?.id || null;
}

function getSafeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function timeAgo(dateStr) {
  const submittedTime = new Date(dateStr).getTime();

  if (Number.isNaN(submittedTime)) {
    return "--";
  }

  const diff = Math.max(0, Math.floor((Date.now() - submittedTime) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatMemory(memoryKb) {
  if (memoryKb === null || memoryKb === undefined) {
    return "--";
  }

  if (memoryKb >= 1024) {
    return `${(memoryKb / 1024).toFixed(1)} MB`;
  }

  return `${memoryKb} KB`;
}

function getFilterKey(verdict) {
  if (verdict === "AC") return "ac";
  if (verdict === "WA") return "wa";
  return "other";
}

function mapProblemSubmission(submission, problemTitle) {
  const verdict = String(submission.verdict || "CE").toUpperCase();

  return {
    problem: submission.problemTitle || problemTitle || "Problem",
    id: `Submission #${submission.id}`,
    verdict,
    time: timeAgo(submission.submittedAt),
    timeLabel: "Submitted Ago",
    mem: formatMemory(submission.memoryKb),
    lang: submission.language,
    f: getFilterKey(verdict),
    at: submission.submittedAt || String(submission.id),
    tc: submission.testCaseNote || "No test-case details available.",
    code: submission.sourceCode || "Source code is not available.",
  };
}

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

function SubmissionsContent({ problem, contestId, refreshKey }) {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const problemSubmissionId = getProblemSubmissionId(problem);
  const contestProblemCode = getContestProblemCode(problem, contestId);

  useEffect(() => {
    if (!problemSubmissionId) {
      setSubmissions([]);
      return;
    }

    let isMounted = true;

    async function fetchSubmissions() {
      setIsLoading(true);
      setError(null);

      try {
        const items = await getProblemSubmissionsApi({
          problemId: problemSubmissionId,
          contestId,
          contestProblemCode,
        });

        if (isMounted) {
          setSubmissions(items);
        }
      } catch (fetchError) {
        if (isMounted) {
          setSubmissions([]);
          setError(fetchError.message || "Failed to load submissions.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSubmissions();

    return () => {
      isMounted = false;
    };
  }, [contestId, contestProblemCode, problemSubmissionId, refreshKey]);

  const submissionRows = useMemo(
    () =>
      submissions.map((submission) =>
        mapProblemSubmission(submission, problem?.title),
      ),
    [problem?.title, submissions],
  );
  const selectedSubmission =
    selectedSubmissionIndex === null
      ? null
      : submissionRows[selectedSubmissionIndex];

  function openSubmission(index) {
    if (index >= 0 && index < submissionRows.length) {
      setSelectedSubmissionIndex(index);
    }
  }

  function closeSubmission() {
    setSelectedSubmissionIndex(null);
  }

  if (!problemSubmissionId) {
    return (
      <div className="px-5 py-6 sm:px-7">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          Problem data is still loading. Submissions will appear here once the
          problem is ready.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-5 py-6 sm:px-7">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-sm text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          Loading submissions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 py-6 sm:px-7">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="px-5 py-6 sm:px-7">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
          No submissions yet. Submit a solution to see it here.
        </div>
      </div>
    );
  }

  return (
    <>
      <SubmissionSlidePanel
        submission={selectedSubmission}
        isOpen={selectedSubmissionIndex !== null}
        onClose={closeSubmission}
      />
      <div className="px-5 py-6 sm:px-7">
        <SubmissionsPanel
          submissions={submissionRows}
          allSubmissions={submissionRows}
          onOpenSubmission={openSubmission}
          title="Problem Submissions"
          totalCount={submissionRows.length}
          emptyMessage="No submissions match this verdict filter."
          problemHint=""
          verdictHint="click for code"
          showLoadMore={false}
        />
      </div>
    </>
  );
}

function EditorialCodeBlock({ code }) {
  const normalizedCode = code.replace(/\s+$/, "");
  const lines = normalizedCode.split("\n");

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2.5">
        <div>
          <p className="text-[12px] font-semibold text-slate-100">
            Optimal Code Solution
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">C++17</p>
        </div>
        <CopyButton text={normalizedCode} tone="dark" />
      </div>

      <div className="max-h-[520px] overflow-auto">
        <ol className="min-w-max py-3 font-mono text-[13px] leading-6">
          {lines.map((line, index) => (
            <li
              key={`${index}-${line}`}
              className="grid grid-cols-[3rem_minmax(0,1fr)] px-4 text-slate-100 hover:bg-white/[0.03]"
            >
              <span className="pr-4 text-right text-slate-500 select-none">
                {index + 1}
              </span>
              <code className="whitespace-pre text-slate-100">
                {line || " "}
              </code>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function EditorialContent({ editorial }) {
  const markdownContent = editorial?.markdownContent?.trim() || "";
  const codeContent = editorial?.codeContent?.trim() || "";
  const videoLink = getSafeExternalUrl(editorial?.videoLink?.trim() || "");
  const markdownHtml = useMemo(() => {
    if (!markdownContent) {
      return "";
    }

    const renderedMarkdown = marked.parse(markdownContent, {
      breaks: true,
      gfm: true,
    });

    return DOMPurify.sanitize(renderedMarkdown);
  }, [markdownContent]);

  if (markdownContent || codeContent || videoLink) {
    return (
      <div className="px-5 py-6 sm:px-7">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Editorial</h2>

        <div className="space-y-5">
          {markdownContent && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-6">
              <div
                className={editorialMarkdownClasses}
                dangerouslySetInnerHTML={{ __html: markdownHtml }}
              />
            </div>
          )}

          {codeContent && (
            <section>
              <EditorialCodeBlock code={codeContent} />
            </section>
          )}

          {videoLink && (
            <section>
              <h3 className="mb-2 text-base font-bold text-slate-800">
                Video Walkthrough
              </h3>
              <a
                href={videoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-[13px] font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
              >
                Open walkthrough
              </a>
            </section>
          )}
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
      </div>
    </div>
  );
}

function ProblemStatement({ problem, contestId, submissionRefreshKey = 0 }) {
  const [activeTab, setActiveTab] = useState("description");
  const visibleTabs = contestId
    ? LEFT_TABS.filter((tab) => tab.key !== "editorial")
    : LEFT_TABS;
  const currentActiveTab =
    contestId && activeTab === "editorial" ? "description" : activeTab;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center gap-0 border-b border-slate-200 bg-slate-50/80 px-4">
        {visibleTabs.map((tab) => {
          const isActive = currentActiveTab === tab.key;
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
                <span className="absolute right-2 bottom-0 left-2 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {currentActiveTab === "description" && (
          <DescriptionContent problem={problem} />
        )}
        {currentActiveTab === "submissions" && (
          <SubmissionsContent
            problem={problem}
            contestId={contestId}
            refreshKey={submissionRefreshKey}
          />
        )}
        {!contestId && currentActiveTab === "editorial" && (
          <EditorialContent editorial={problem.editorial} />
        )}
      </div>
    </div>
  );
}

export default ProblemStatement;
