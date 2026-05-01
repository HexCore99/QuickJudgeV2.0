import { useCallback, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { CODE_TEMPLATES, LANGUAGES } from "../codeTemplates";
import EditorToolbar from "./EditorToolbar";
import IOPanel from "./IOPanel";

const MOCK_SUBMIT_RESULTS = [
  {
    verdict: "Accepted",
    output:
      "All test cases passed.\n\nTest 1: PASS (12ms)\nTest 2: PASS (8ms)\nTest 3: PASS (15ms)\nTest 4: PASS (11ms)",
    details: { time: "55ms", memory: "4.2 MB" },
  },
  {
    verdict: "Wrong Answer",
    output: "Expected:\n0 1\n\nYour Output:\n1 2\n\nDiff:\n- 0 1\n+ 1 2",
    details: { time: "14ms", memory: "3.8 MB", testCase: 3 },
  },
  {
    verdict: "Compilation Error",
    output: `main.cpp: In function 'int main()':
main.cpp:7:18: error: expected ';' before '}' token
    7 |     int x = 5
      |                  ^
      |                  ;
    8 | }`,
    details: {},
  },
  {
    verdict: "Runtime Error",
    output: `Signal: SIGSEGV

Stack trace:
  #0  0x00005601 in main () at solution.cpp:12
  #1  0x00007f42 in __libc_start_main

Error: Array index out of bounds.`,
    details: { time: "0ms", memory: "3.2 MB", testCase: 4 },
  },
  {
    verdict: "Time Limit Exceeded",
    output:
      "Execution timed out after 1000ms.\n\nYour solution exceeded the time limit on this test case.",
    details: { time: "> 1000ms", memory: "5.1 MB", testCase: 5 },
  },
];

const MOCK_RUN_RESULTS = [
  {
    verdict: null,
    output: "0 1",
    details: { time: "12ms", memory: "3.6 MB" },
  },
  {
    verdict: "Compilation Error",
    output: `main.cpp:8:5: error: 'cout' was not declared in this scope
    8 |     cout << "hello";
      |     ^~~~`,
    details: {},
  },
  {
    verdict: "Runtime Error",
    output: `terminate called after throwing an instance of 'std::out_of_range'
  what(): vector::_M_range_check`,
    details: { time: "3ms", memory: "3.4 MB" },
  },
];

function CodeEditorPanel({ isExpanded, onExpandToggle }) {
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [activeIoTab, setActiveIoTab] = useState("input");
  const [code, setCode] = useState(CODE_TEMPLATES.cpp);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [executionDetails, setExecutionDetails] = useState(null);

  const submitIndex = useRef(0);
  const runIndex = useRef(0);

  const currentMonacoLang =
    LANGUAGES.find((lang) => lang.id === language)?.monacoLang || "cpp";

  const handleLanguageChange = useCallback((langId) => {
    setLanguage(langId);
    setCode(CODE_TEMPLATES[langId] || "");
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  }, []);

  const handleReset = useCallback(() => {
    setCode(CODE_TEMPLATES[language] || "");
    setOutput("");
    setVerdict(null);
    setExecutionDetails(null);
    setActiveIoTab("input");
  }, [language]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setVerdict(null);
    setOutput("");
    setExecutionDetails(null);
    setActiveIoTab("output");

    const mockResult = MOCK_RUN_RESULTS[runIndex.current % MOCK_RUN_RESULTS.length];
    runIndex.current += 1;

    window.setTimeout(() => {
      setVerdict(mockResult.verdict);
      setOutput(mockResult.output);
      setExecutionDetails(mockResult.details);
      setIsRunning(false);
    }, 1200);
  }, []);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    setVerdict(null);
    setOutput("");
    setExecutionDetails(null);
    setActiveIoTab("output");

    const mockResult =
      MOCK_SUBMIT_RESULTS[submitIndex.current % MOCK_SUBMIT_RESULTS.length];
    submitIndex.current += 1;

    window.setTimeout(() => {
      setVerdict(mockResult.verdict);
      setOutput(mockResult.output);
      setExecutionDetails(mockResult.details);
      setIsSubmitting(false);
    }, 1800);
  }, []);

  const handleSubmitFile = useCallback((fileContent, detectedLang, fileName) => {
    setCode(fileContent);

    if (detectedLang && LANGUAGES.some((lang) => lang.id === detectedLang)) {
      setLanguage(detectedLang);
    }

    setIsSubmitting(true);
    setVerdict(null);
    setOutput("");
    setExecutionDetails(null);
    setActiveIoTab("output");

    const mockResult =
      MOCK_SUBMIT_RESULTS[submitIndex.current % MOCK_SUBMIT_RESULTS.length];
    submitIndex.current += 1;

    window.setTimeout(() => {
      setVerdict(mockResult.verdict);
      setOutput(`Submitted file: ${fileName}\n\n${mockResult.output}`);
      setExecutionDetails(mockResult.details);
      setIsSubmitting(false);
    }, 1800);
  }, []);

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
      />

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={currentMonacoLang}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value || "")}
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
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            roundedSelection: true,
            formatOnPaste: true,
          }}
          loading={
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Loading editor...
            </div>
          }
        />
      </div>

      <IOPanel
        activeTab={activeIoTab}
        onActiveTabChange={setActiveIoTab}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
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
