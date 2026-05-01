const inputClasses =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";

export default function CreateContestGeneralInformation({
  formData,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
        General Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Contest Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="e.g. Weekly Algo Sprint #15"
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Description
          </label>
          <textarea
            rows={6}
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Describe the contest rules..."
            className={`resize-none ${inputClasses}`}
          />
        </div>
      </div>
    </div>
  );
}
