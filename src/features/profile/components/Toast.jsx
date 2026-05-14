import { useEffect, useState } from "react";
import { CheckCircle, Info, AlertCircle } from "lucide-react";

const iconMap = {
  success: { Icon: CheckCircle, color: "text-green-600" },
  info: { Icon: Info, color: "text-blue-600" },
  error: { Icon: AlertCircle, color: "text-red-600" },
};

function ToastItem({ msg, type = "info", onRemove }) {
  const [exiting, setExiting] = useState(false);
  const { Icon, color } = iconMap[type] || iconMap.info;

  useEffect(() => {
    const fadeTimer = setTimeout(() => setExiting(true), 2600);
    const removeTimer = setTimeout(onRemove, 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onRemove]);

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-amber-600/20 bg-white px-5 py-3 text-[13px] text-slate-800 shadow-lg transition-all duration-300 ${
        exiting
          ? "translate-x-10 opacity-0"
          : "animate-in translate-x-0 opacity-100"
      }`}
      style={{
        animation: exiting
          ? undefined
          : "toastIn 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
      {msg}
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="z-index:1000 fixed top-6 right-6 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          msg={t.msg}
          type={t.type}
          onRemove={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}
