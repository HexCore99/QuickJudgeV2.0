function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-m transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 text-3xl text-slate-800">{icon}</div>
      <h3 className="mb-3 text-2xl font-bold text-slate-900">{title}</h3>
      <p className="text-lg leading-8 text-slate-500">{description}</p>
    </div>
  );
}

export default FeatureCard;
