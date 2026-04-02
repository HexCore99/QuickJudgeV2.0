function DemoAccess({ onStudentDemo, onAdminDemo, disabled }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="tet-slate-500 mb-3 text-center text-sm font-medium">
        Demo Access
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onStudentDemo}
          disabled={disabled}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Student Demo
        </button>

        <button
          type="button"
          onClick={onAdminDemo}
          disabled={disabled}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Admin Demo
        </button>
      </div>
    </div>
  );
}

export default DemoAccess;
