export default function ContestDetailsHeader({ title, statusText, duration }) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4">
      <h1 className="text-3xl font-black text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Status: {statusText} . Duration: {duration}
      </p>
    </div>
  );
}
