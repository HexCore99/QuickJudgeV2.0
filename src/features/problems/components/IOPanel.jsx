import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  MemoryStick,
  Play,
  Send,
  Upload,
  XCircle,
} from "lucide-react";

const IO_TABS = [
  { key: "input", label: "Custom Input" },
  { key: "output", label: "Output" },
];

const MIN_HEIGHT = 40;
const DEFAULT_HEIGHT = 180;

const VERDICT_CONFIG = {
  Accepted: {
    badge: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    headerBg: "bg-emerald-50 border-emerald-200",
    headerText: "text-emerald-700",
    label: "Accepted",
  },
  "Wrong Answer": {
    badge: "bg-rose-100 text-rose-700",
    icon: XCircle,
    headerBg: "bg-rose-50 border-rose-200",
    headerText: "text-rose-700",
    label: "Wrong Answer",
  },
  "Compilation Error": {
    badge: "bg-red-100 text-red-700",
    icon: XCircle,
    headerBg: "bg-red-50 border-red-200",
    headerText: "text-red-700",
    label: "Compilation Error",
  },
  "Runtime Error": {
    badge: "bg-orange-100 text-orange-700",
    icon: Bug,
    headerBg: "bg-orange-50 border-orange-200",
    headerText: "text-orange-700",
    label: "Runtime Error",
  },
  "Time Limit Exceeded": {
    badge: "bg-amber-100 text-amber-700",
    icon: Clock,
    headerBg: "bg-amber-50 border-amber-200",
    headerText: "text-amber-700",
    label: "Time Limit Exceeded",
  },
  "Memory Limit Exceeded": {
    badge: "bg-purple-100 text-purple-700",
    icon: MemoryStick,
    headerBg: "bg-purple-50 border-purple-200",
    headerText: "text-purple-700",
    label: "Memory Limit Exceeded",
  },
};

const DEFAULT_VERDICT_CONFIG = {
  badge: "bg-slate-100 text-slate-600",
  icon: AlertTriangle,
  headerBg: "bg-slate-50 border-slate-200",
  headerText: "text-slate-600",
  label: "Unknown",
};

const EXT_TO_LANG = {
  c: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  java: "java",
  py: "python",
  rs: "rust",
};

function IOPanel({
  activeTab,
  onActiveTabChange,
  customInput,
  onCustomInputChange,
  output,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
  onSubmitFile,
  verdict,
  executionDetails,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [panelHeight, setPanelHeight] = useState(DEFAULT_HEIGHT);
  const [maxHeight, setMaxHeight] = useState(600);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    function updateMaxHeight() {
      if (!containerRef.current) {
        return;
      }

      const parent = containerRef.current.parentElement;

      if (!parent) {
        return;
      }

      const parentHeight = parent.getBoundingClientRect().height;
      setMaxHeight(Math.max(200, Math.floor(parentHeight * 0.8)));
    }

    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  const handleDragStart = useCallback(
    (event) => {
      event.preventDefault();
      isDragging.current = true;
      startY.current = event.clientY;
      startHeight.current = panelHeight;
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    },
    [panelHeight],
  );

  const handleDragMove = useCallback(
    (event) => {
      if (!isDragging.current) {
        return;
      }

      const delta = startY.current - event.clientY;
      let newHeight = startHeight.current + delta;
      newHeight = Math.max(MIN_HEIGHT, Math.min(maxHeight, newHeight));
      setPanelHeight(newHeight);
      setCollapsed(newHeight <= MIN_HEIGHT + 10);
    },
    [maxHeight],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) {
      return;
    }

    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove]);

  function handleToggleCollapse() {
    if (collapsed) {
      setCollapsed(false);
      setPanelHeight(DEFAULT_HEIGHT);
      return;
    }

    setCollapsed(true);
    setPanelHeight(MIN_HEIGHT);
  }

  function handleFileSelect() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const detectedLang = EXT_TO_LANG[ext];
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const fileContent = loadEvent.target?.result;

      if (typeof fileContent === "string") {
        onSubmitFile?.(fileContent, detectedLang, file.name);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  const contentHeight = collapsed ? 0 : panelHeight - MIN_HEIGHT;
  const verdictConfig = verdict
    ? VERDICT_CONFIG[verdict] || DEFAULT_VERDICT_CONFIG
    : null;

  return (
    <div
      ref={containerRef}
      className="flex shrink-0 flex-col border-t border-slate-200 bg-white"
      style={{ height: panelHeight }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".c,.cpp,.cc,.cxx,.java,.py,.rs,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onMouseDown={handleDragStart}
        className="group flex h-1.5 shrink-0 cursor-row-resize items-center justify-center transition-colors hover:bg-amber-100/60"
      >
        <div className="h-0.5 w-10 rounded-full bg-slate-200 transition-all group-hover:w-16 group-hover:bg-amber-500" />
      </div>

      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-1.5">
        <div className="flex items-center gap-1">
          {IO_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                onActiveTabChange(tab.key);

                if (collapsed) {
                  setCollapsed(false);
                  setPanelHeight(DEFAULT_HEIGHT);
                }
              }}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition ${
                activeTab === tab.key && !collapsed
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {verdictConfig && (
            <span
              className={`ml-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${verdictConfig.badge}`}
            >
              <verdictConfig.icon size={12} />
              {verdictConfig.label}
            </span>
          )}

          {executionDetails && verdict && (
            <span className="ml-2 text-[11px] text-slate-400">
              {executionDetails.time && `${executionDetails.time}`}
              {executionDetails.time && executionDetails.memory && " · "}
              {executionDetails.memory && `${executionDetails.memory}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600"
            title={collapsed ? "Expand panel" : "Collapse panel"}
          >
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <div className="h-5 w-px bg-slate-200" />

          <button
            type="button"
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Play size={13} />
            )}
            Run
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} />
            )}
            Submit
          </button>

          <button
            type="button"
            onClick={handleFileSelect}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            title="Upload and submit a code file"
          >
            <Upload size={13} />
            Submit File
          </button>
        </div>
      </div>

      {!collapsed && contentHeight > 0 && (
        <div className="min-h-0 flex-1 overflow-hidden">
          {activeTab === "input" ? (
            <textarea
              value={customInput}
              onChange={(event) => onCustomInputChange(event.target.value)}
              placeholder="Enter your custom input here..."
              spellCheck={false}
              className="h-full w-full resize-none border-0 bg-white px-4 py-3 font-mono text-[13px] leading-6 text-slate-700 outline-none placeholder:text-slate-300"
            />
          ) : (
            <div className="h-full overflow-auto">
              {verdictConfig && (
                <div
                  className={`flex items-center gap-2 border-b px-4 py-2.5 ${verdictConfig.headerBg}`}
                >
                  <verdictConfig.icon
                    size={16}
                    className={verdictConfig.headerText}
                  />
                  <span
                    className={`text-[13px] font-semibold ${verdictConfig.headerText}`}
                  >
                    {verdictConfig.label}
                  </span>

                  {executionDetails?.testCase && (
                    <span className="text-[12px] text-slate-400">
                      on test case {executionDetails.testCase}
                    </span>
                  )}

                  {executionDetails?.time && (
                    <span className="ml-auto text-[11px] text-slate-400">
                      {executionDetails.time}
                      {executionDetails.memory &&
                        ` · ${executionDetails.memory}`}
                    </span>
                  )}
                </div>
              )}

              <pre className="px-4 py-3 font-mono text-[13px] leading-6 text-slate-700">
                {output || "Run your code to see output here."}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IOPanel;
