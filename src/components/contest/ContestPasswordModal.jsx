import { X } from "lucide-react";
import AppButton from "../common/AppButton";
import AppTextInput from "../common/AppTextInput";

function ContestPasswordModal({
  isOpen,
  contest,
  password,
  error,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen | !contest) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Enter Contest Password
            </h2>
            <p className="text-slate500 mt-2 text-lg">
              Enter the password to join {contest.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <AppTextInput
            type="password"
            value={password}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Contest Password"
          />

          {error ? (
            <div className="b-red-50 rounded-xl border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <AppButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full py-4 text-lg"
          >
            {isSubmitting ? "Joining..." : "Join Contest"}
          </AppButton>
        </form>
      </div>
    </div>
  );
}

export default ContestPasswordModal;
