import { useCallback, useEffect, useRef, useState } from "react";

function SplitPane({
  left,
  right,
  defaultLeftWidth = 42,
  minLeftWidth = 25,
  maxLeftWidth = 70,
  isExpanded = false,
}) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.innerWidth >= 1024;
  });

  const isDragging = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function updateViewportMode() {
      setIsDesktop(window.innerWidth >= 1024);
    }

    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);

    return () => {
      window.removeEventListener("resize", updateViewportMode);
    };
  }, []);

  const handleMouseDown = useCallback(
    (event) => {
      if (isExpanded) {
        return;
      }

      event.preventDefault();
      isDragging.current = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [isExpanded],
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging.current || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      let pct = (x / rect.width) * 100;
      pct = Math.max(minLeftWidth, Math.min(maxLeftWidth, pct));
      setLeftWidth(pct);
    },
    [maxLeftWidth, minLeftWidth],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) {
      return;
    }

    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!isDesktop) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        {!isExpanded && (
          <div className="min-h-0 basis-[45%] overflow-hidden">{left}</div>
        )}
        {!isExpanded && <div className="h-px bg-slate-200" />}
        <div className="min-h-0 flex-1 overflow-hidden">{right}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      <div
        className="h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out"
        style={{ width: `${isExpanded ? 0 : leftWidth}%` }}
      >
        {left}
      </div>

      {!isExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className="group relative z-10 flex h-full w-2 shrink-0 cursor-col-resize items-center justify-center transition-colors hover:bg-amber-100/60"
        >
          <div className="h-8 w-1 rounded-full bg-slate-300 transition-all group-hover:h-12 group-hover:bg-amber-500" />
        </div>
      )}

      <div className="h-full min-w-0 flex-1 overflow-hidden">{right}</div>
    </div>
  );
}

export default SplitPane;
