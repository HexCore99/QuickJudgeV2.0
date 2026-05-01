import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  Sun,
} from "lucide-react";
import { LANGUAGES } from "../codeTemplates";

function EditorToolbar({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  isExpanded,
  onExpandToggle,
  onReset,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang =
    LANGUAGES.find((lang) => lang.id === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#2d2d2d] bg-[#1e1e1e] px-3">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#252526] px-3 py-1.5 text-[13px] font-medium text-slate-300 shadow-sm transition hover:border-[#444] hover:bg-[#2d2d2d] hover:text-slate-100"
        >
          {currentLang.label}
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-xl border border-[#333] bg-[#252526] py-1 shadow-xl shadow-black/50">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  onLanguageChange(lang.id);
                  setDropdownOpen(false);
                }}
                className={`flex w-full items-center px-3.5 py-2 text-[13px] transition ${
                  lang.id === language
                    ? "bg-amber-500/10 font-semibold text-amber-500"
                    : "text-slate-300 hover:bg-[#333] hover:text-slate-100"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onThemeToggle}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-[#333] hover:text-slate-200"
          title={theme === "vs-dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "vs-dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          type="button"
          onClick={onExpandToggle}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-[#333] hover:text-slate-200"
          title={isExpanded ? "Collapse statement" : "Expand editor"}
        >
          {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-[#333] hover:text-rose-400"
          title="Reset code"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
