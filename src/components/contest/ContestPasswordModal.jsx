import { Lock, X } from "lucide-react";
import Button from "../common/Button";
import AppTextInput from "../common/AppTextInput";
import Error from "../common/Error";

function ContestPasswordModal({
  isOpen,
  contest,
  passwordInput,
  setPasswordInput,
  error,
  onClose,
  onSubmit,
}) {
  if (!isOpen || !contest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        {/* header*/}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Lock className="h-4.5 w-4.5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Contest Password
              </h3>
              <p className="text-xs text-slate-500">{contest.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Password Field*/}
        <form onSubmit={onSubmit}>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Enter password
          </label>

          <AppTextInput
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Contest password"
          />

          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              Enter Contest
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContestPasswordModal;
