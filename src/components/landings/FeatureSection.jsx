import FeatureCard from "./FeatureCard";
function FeatureSection() {
  const features = [
    {
      icon: "⌨",
      title: "Built-in Code Editor",
      description:
        "Monaco-powered editor with syntax highlighting and language support.",
    },
    {
      icon: "🏆",
      title: "Contest Workflow",
      description:
        "Create and join educational programming contests with ease.",
    },
    {
      icon: "🗂",
      title: "Problem Bank",
      description: "Organize and reuse problems across multiple contests.",
    },
    {
      icon: "📢",
      title: "Announcements",
      description: "Keep participants informed with real-time announcements.",
    },
    {
      icon: "📊",
      title: "Leaderboard",
      description: "Track standings and celebrate top performers.",
    },
    {
      icon: "💬",
      title: "Discussion & Editorials",
      description:
        "Learn from peers with discussions and editorial breakdowns.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="mb-14 text-center font-mono text-3xl font-black text-slate-900 ">
        Everything You Need
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
