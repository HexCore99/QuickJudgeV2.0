import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CODE_TEMPLATES, LANGUAGES } from "../codeTemplates";
import { getDraftApi, saveDraftApi } from "../../drafts/draftsApi";
import { runCodeApi, submitCodeApi } from "../../submissions/submissionsApi";
import EditorToolbar from "./EditorToolbar";
import IOPanel from "./IOPanel";

const Editor = lazy(() => import("@monaco-editor/react"));
const AUTOSAVE_DELAY_MS = 3000;

const VERDICT_LABELS = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  RE: "Runtime Error",
  CE: "Compilation Error",
  MLE: "Memory Limit Exceeded",
  PE: "Wrong Answer",
};

function formatRuntime(runtimeMs) {
  if (runtimeMs === null || runtimeMs === undefined) return null;

  return `${runtimeMs}ms`;
}

function formatMemory(memoryKb) {
  if (memoryKb === null || memoryKb === undefined) return null;

  if (memoryKb >= 1024) {
    return `${(memoryKb / 1024).toFixed(1)} MB`;
  }

  return `${memoryKb} KB`;
}

function formatDetails(result = {}) {
  return {
    time: formatRuntime(result.runtimeMs),
    memory: formatMemory(result.memoryKb),
  };
}

function isPositiveInteger(value) {
  const numberValue = Number(value);

  return Number.isInteger(numberValue) && numberValue > 0;
}

function getProblemSubmissionId(problem) {
  const candidate = problem?.problemBankId || problem?.problemId || problem?.id;

  return isPositiveInteger(candidate) ? Number(candidate) : null;
}

function getLocalDraftUserKey() {
  try {
    const savedUser = JSON.parse(localStorage.getItem("qj_user") || "{}");
    return savedUser?.id || savedUser?.email || "anonymous";
  } catch {
    return "anonymous";
  }
}

function readLocalDraft(key) {
  try {
    const draft = JSON.parse(localStorage.getItem(key) || "null");

    if (!draft || typeof draft.sourceCode !== "string") {
      return null;
    }

    return draft;
  } catch {
    return null;
  }
}

function writeLocalDraft(key, draft) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        ...draft,
        updatedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // localStorage can be unavailable or full; DB autosave remains primary.
  }
}

function pickLatestDraft(dbDraft, localDraft) {
  if (!dbDraft) return localDraft;
  if (!localDraft) return dbDraft;

  const dbTime = new Date(dbDraft.updatedAt || 0).getTime();
  const localTime = new Date(localDraft.updatedAt || 0).getTime();

  return localTime > dbTime ? localDraft : dbDraft;
}

function isSupportedLanguage(language) {
  return LANGUAGES.some((lang) => lang.id === language);
}

function getSubmissionDisplayOutput(submission, outputPrefix = "") {
  return `${outputPrefix}${
    submission.testCaseNote || submission.output || "Submission finished."
  }`;
}

function buildSubmissionLockKey({
  problemId,
  contestId,
  contestProblemCode,
  language,
  sourceCode,
}) {
  return JSON.stringify({
    problemId,
    contestId: contestId || "",
    contestProblemCode: contestProblemCode || "",
    language,
    sourceCode,
  });
}

function CodeEditorPanel({
  problem,
  contestId,
  isExpanded,
  onExpandToggle,
  onSubmissionStored,
}) {
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(CODE_TEMPLATES.cpp);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [executionDetails, setExecutionDetails] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [isDraftReady, setIsDraftReady] = useState(false);

  const latestDraftRef = useRef({
    code: CODE_TEMPLATES.cpp,
    language: "cpp",
    customInput: "",
  });
  const hasUnsavedDraftRef = useRef(false);
  const autosaveTimerRef = useRef(null);
  const draftLoadRequestRef = useRef(0);
  const activeSubmissionKeyRef = useRef(null);
  const lastSubmittedKeyRef = useRef(null);

  const currentMonacoLang =
    LANGUAGES.find((lang) => lang.id === language)?.monacoLang || "cpp";

  const problemSubmissionId = getProblemSubmissionId(problem);
  const contestProblemCode = contestId
    ? problem?.contestProblemCode || problem?.id
    : null;

  const draftContext = useMemo(() => {
    if (!problemSubmissionId) {
      return null;
    }

    return {
      problemId: problemSubmissionId,
      contestId: contestId || null,
      contestProblemCode: contestProblemCode || null,
    };
  }, [contestId, contestProblemCode, problemSubmissionId]);

  const localDraftKey = useMemo(() => {
    if (!draftContext) {
      return null;
    }

    return [
      "qj_code_draft",
      getLocalDraftUserKey(),
      draftContext.problemId,
      draftContext.contestId || "",
      draftContext.contestProblemCode || "",
    ].join(":");
  }, [draftContext]);

  useEffect(() => {
    latestDraftRef.current = { code, language, customInput };
  }, [code, customInput, language]);

  const persistLocalDraft = useCallback(
    ({ sourceCode, selectedLanguage, input }) => {
      if (!localDraftKey) {
        return;
      }

      writeLocalDraft(localDraftKey, {
        language: selectedLanguage,
        sourceCode,
        customInput: input || "",
      });
    },
    [localDraftKey],
  );

  const markDraftChanged = useCallback(
    ({ sourceCode, selectedLanguage, input }) => {
      hasUnsavedDraftRef.current = true;
      persistLocalDraft({ sourceCode, selectedLanguage, input });
    },
    [persistLocalDraft],
  );

  const saveDraftNow = useCallback(
    async (override = {}) => {
      if (!draftContext) {
        return null;
      }

      const current = latestDraftRef.current;
      const sourceCode = override.sourceCode ?? current.code;
      const selectedLanguage = override.selectedLanguage ?? current.language;
      const input = override.input ?? current.customInput;

      persistLocalDraft({ sourceCode, selectedLanguage, input });

      if (!String(sourceCode || "").trim()) {
        return null;
      }

      if (!override.force && !hasUnsavedDraftRef.current) {
        return null;
      }

      setSaveStatus("Saving...");

      try {
        const savedDraft = await saveDraftApi({
          ...draftContext,
          language: selectedLanguage,
          sourceCode,
          customInput: input,
        });
        const latest = latestDraftRef.current;

        if (
          latest.code === sourceCode &&
          latest.language === selectedLanguage &&
          latest.customInput === input
        ) {
          hasUnsavedDraftRef.current = false;
          setSaveStatus("Saved");
        }

        return savedDraft;
      } catch {
        setSaveStatus("Save failed");
        return null;
      }
    },
    [draftContext, persistLocalDraft],
  );

  useEffect(() => {
    if (!draftContext || !localDraftKey) {
      return undefined;
    }

    let isMounted = true;
    const requestId = draftLoadRequestRef.current + 1;
    draftLoadRequestRef.current = requestId;
    setIsDraftReady(false);
    setSaveStatus("");
    hasUnsavedDraftRef.current = false;

    async function loadDraft() {
      const localDraft = readLocalDraft(localDraftKey);

      try {
        const dbDraft = await getDraftApi(draftContext);

        if (!isMounted || draftLoadRequestRef.current !== requestId) {
          return;
        }

        const draft = pickLatestDraft(dbDraft, localDraft);

        if (draft) {
          const draftLanguage = isSupportedLanguage(draft.language)
            ? draft.language
            : "cpp";

          setLanguage(draftLanguage);
          setCode(draft.sourceCode || CODE_TEMPLATES[draftLanguage] || "");
          setCustomInput(draft.customInput || "");
        } else {
          setLanguage("cpp");
          setCode(CODE_TEMPLATES.cpp);
          setCustomInput("");
        }
      } catch {
        if (!isMounted || draftLoadRequestRef.current !== requestId) {
          return;
        }

        if (localDraft) {
          const draftLanguage = isSupportedLanguage(localDraft.language)
            ? localDraft.language
            : "cpp";

          setLanguage(draftLanguage);
          setCode(localDraft.sourceCode || CODE_TEMPLATES[draftLanguage] || "");
          setCustomInput(localDraft.customInput || "");
        } else {
          setLanguage("cpp");
          setCode(CODE_TEMPLATES.cpp);
          setCustomInput("");
        }

        setSaveStatus("Save failed");
      } finally {
        if (isMounted && draftLoadRequestRef.current === requestId) {
          hasUnsavedDraftRef.current = false;
          setIsDraftReady(true);
        }
      }
    }

    loadDraft();

    return () => {
      isMounted = false;
      window.clearTimeout(autosaveTimerRef.current);
    };
  }, [draftContext, localDraftKey]);

  useEffect(() => {
    if (!isDraftReady || !draftContext || !hasUnsavedDraftRef.current) {
      return undefined;
    }

    window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = window.setTimeout(() => {
      saveDraftNow();
    }, AUTOSAVE_DELAY_MS);

    return () => {
      window.clearTimeout(autosaveTimerRef.current);
    };
  }, [code, customInput, draftContext, isDraftReady, language, saveDraftNow]);

  const handleLanguageChange = useCallback(
    (langId) => {
      if (langId === language) {
        return;
      }

      const oldTemplate = CODE_TEMPLATES[language] || "";
      const nextCode =
        code === oldTemplate ? CODE_TEMPLATES[langId] || "" : code;

      setLanguage(langId);
      setCode(nextCode);
      markDraftChanged({
        sourceCode: nextCode,
        selectedLanguage: langId,
        input: customInput,
      });
      saveDraftNow({
        sourceCode: nextCode,
        selectedLanguage: langId,
        input: customInput,
        force: true,
      });
    },
    [code, customInput, language, markDraftChanged, saveDraftNow],
  );

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  }, []);

  const handleReset = useCallback(() => {
    const template = CODE_TEMPLATES[language] || "";

    setCode(template);
    setOutput("");
    setVerdict(null);
    setExecutionDetails(null);
    markDraftChanged({
      sourceCode: template,
      selectedLanguage: language,
      input: customInput,
    });
  }, [customInput, language, markDraftChanged]);

  const buildPayload = useCallback(
    (sourceCode, selectedLanguage) => ({
      problemId: problemSubmissionId,
      contestId,
      contestProblemCode,
      language: selectedLanguage,
      sourceCode,
      stdin: customInput,
    }),
    [contestId, contestProblemCode, customInput, problemSubmissionId],
  );

  const handleRun = useCallback(async () => {
    if (!problemSubmissionId) {
      setOutput("Problem data is still loading. Try again in a moment.");
      return;
    }

    setIsRunning(true);
    setVerdict(null);
    setOutput("");
    setExecutionDetails(null);

    try {
      await saveDraftNow();
      const result = await runCodeApi(buildPayload(code, language));
      const verdictLabel =
        result.verdictLabel || VERDICT_LABELS[result.verdict] || null;

      setVerdict(verdictLabel);
      setOutput(result.output || "Program finished with no output.");
      setExecutionDetails(formatDetails(result));
    } catch (error) {
      setVerdict("Runtime Error");
      setOutput(error.message || "Failed to run code.");
      setExecutionDetails(null);
    } finally {
      setIsRunning(false);
    }
  }, [buildPayload, code, language, problemSubmissionId, saveDraftNow]);

  const submitSource = useCallback(
    async (sourceCode, selectedLanguage, outputPrefix = "") => {
      if (!problemSubmissionId) {
        setOutput("Problem data is still loading. Try again in a moment.");
        return;
      }

      const submissionKey = buildSubmissionLockKey({
        problemId: problemSubmissionId,
        contestId,
        contestProblemCode,
        language: selectedLanguage,
        sourceCode,
      });

      if (activeSubmissionKeyRef.current === submissionKey) {
        setVerdict(null);
        setExecutionDetails(null);
        setOutput(
          "This exact code is already being submitted. Please wait for the current submission to finish.",
        );
        return;
      }

      if (lastSubmittedKeyRef.current === submissionKey) {
        setVerdict(null);
        setExecutionDetails(null);
        setOutput(
          "No changes detected since your last submission. Edit your code before submitting again.",
        );
        return;
      }

      activeSubmissionKeyRef.current = submissionKey;
      setIsSubmitting(true);
      setVerdict(null);
      setOutput("");
      setExecutionDetails(null);

      try {
        await saveDraftNow({
          sourceCode,
          selectedLanguage,
          input: customInput,
        });
        const submission = await submitCodeApi(
          buildPayload(sourceCode, selectedLanguage),
        );
        const verdictLabel =
          submission.verdictLabel ||
          VERDICT_LABELS[submission.verdict] ||
          "Runtime Error";

        setVerdict(verdictLabel);
        setOutput(getSubmissionDisplayOutput(submission, outputPrefix));
        setExecutionDetails(formatDetails(submission));
        lastSubmittedKeyRef.current = submissionKey;
        onSubmissionStored?.(submission);
      } catch (error) {
        const message = error.message || "Failed to submit code.";
        const isDuplicateSubmission = message
          .toLowerCase()
          .match(/already being submitted|no changes detected/);

        setVerdict(isDuplicateSubmission ? null : "Runtime Error");
        setOutput(message);
        setExecutionDetails(null);
      } finally {
        if (activeSubmissionKeyRef.current === submissionKey) {
          activeSubmissionKeyRef.current = null;
        }

        setIsSubmitting(false);
      }
    },
    [
      buildPayload,
      contestId,
      contestProblemCode,
      customInput,
      onSubmissionStored,
      problemSubmissionId,
      saveDraftNow,
    ],
  );

  const handleSubmit = useCallback(() => {
    submitSource(code, language);
  }, [code, language, submitSource]);

  const handleSubmitFile = useCallback(
    (fileContent, detectedLang, fileName) => {
      const selectedLanguage =
        detectedLang && LANGUAGES.some((lang) => lang.id === detectedLang)
          ? detectedLang
          : language;

      setCode(fileContent);

      if (selectedLanguage !== language) {
        setLanguage(selectedLanguage);
      }

      markDraftChanged({
        sourceCode: fileContent,
        selectedLanguage,
        input: customInput,
      });

      submitSource(
        fileContent,
        selectedLanguage,
        `Submitted file: ${fileName}\n\n`,
      );
    },
    [customInput, language, markDraftChanged, submitSource],
  );

  const handleCodeChange = useCallback(
    (value) => {
      const nextCode = value || "";

      setCode(nextCode);
      markDraftChanged({
        sourceCode: nextCode,
        selectedLanguage: language,
        input: customInput,
      });
    },
    [customInput, language, markDraftChanged],
  );

  const handleCustomInputChange = useCallback(
    (value) => {
      setCustomInput(value);
      markDraftChanged({
        sourceCode: code,
        selectedLanguage: language,
        input: value,
      });
    },
    [code, language, markDraftChanged],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-none border-l border-slate-200 bg-white">
      <EditorToolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        isExpanded={isExpanded}
        onExpandToggle={onExpandToggle}
        onReset={handleReset}
        saveStatus={saveStatus}
      />

      <div className="min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Loadin Editor.....
            </div>
          }
        >
          <Editor
            height="100%"
            language={currentMonacoLang}
            theme={theme}
            value={code}
            onChange={handleCodeChange}
            options={{
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: "line",
              bracketPairColorization: { enabled: true },
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "off",
              scrollBeyondLastColumn: 20,
              revealHorizontalRightPadding: 80,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "off",
              roundedSelection: true,
              formatOnPaste: true,
            }}
            loading={
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Loading editor...
              </div>
            }
          />
        </Suspense>
      </div>

      <IOPanel
        customInput={customInput}
        onCustomInputChange={handleCustomInputChange}
        output={output}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        onRun={handleRun}
        onSubmit={handleSubmit}
        onSubmitFile={handleSubmitFile}
        verdict={verdict}
        executionDetails={executionDetails}
      />
    </div>
  );
}

export default CodeEditorPanel;
