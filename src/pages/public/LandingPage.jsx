import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Code2,
  FolderKanban,
  Megaphone,
  MessagesSquare,
  Terminal,
  Trophy,
} from "lucide-react";

const languages = ["C", "C++", "Java", "Python"];

const features = [
  {
    icon: Code2,
    title: "Built-in Code Editor",
    description:
      "Monaco-powered editor with syntax highlighting and language support.",
  },
  {
    icon: Trophy,
    title: "Contest Workflow",
    description:
      "Create and join educational programming contests with a simple flow.",
  },
  {
    icon: FolderKanban,
    title: "Problem Bank",
    description: "Organize and reuse problems across multiple contests.",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description: "Keep participants informed with real-time updates.",
  },
  {
    icon: BarChart3,
    title: "Leaderboard",
    description: "Track standings and celebrate top performers.",
  },
  {
    icon: MessagesSquare,
    title: "Discussion & Editorials",
    description: "Help students learn from peers and post-contest writeups.",
  },
];

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Icon className="mb-4 h-8 w-8 text-slate-800" />
      <h3 className="mb-3 text-2xl font-bold text-slate-900">{title}</h3>
      <p className="text-lg leading-8 text-slate-500">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-0.5 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-sm font-medium text-slate-500">
          <Terminal className="h-4 w-4" />
          <span>Educational Online Judge</span>
        </div>

        <h1 className="max-w-4xl font-mono text-4xl leading-tight font-black text-slate-900 md:text-5xl">
          Simple. Clean.
          <br />
          Problem Solving.
        </h1>

        <p className="mt-3 max-w-4xl text-xl leading-10 text-slate-500 md:text-xl">
          QuickJudge is a minimal online judge platform built for educational
          programming contests, with less overhead and more focus on code.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="rounded-2xl bg-slate-900 px-6 py-3 text-lg font-semibold text-white transition hover:bg-slate-800"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-lg font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Login
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {languages.map((lang) => (
            <span
              key={lang}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-14 text-center font-mono text-3xl font-black text-slate-900">
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

      <section className="mx-auto max-w-6xl px-6 py-15 text-center">
        <BookOpen className="mx-auto mb-6 h-12 w-12 text-slate-800" />
        <h2 className="font-mono text-4xl font-black text-slate-900">
          Built for Education
        </h2>

        <p className="mx-auto mt-8 max-w-5xl text-xl leading-10 text-slate-500">
          QuickJudge is designed for teachers, TAs, and student communities who
          want to run programming contests without the overhead of complex
          platforms. Create problems, organize contests, and let students focus
          on solving problems and learning.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-slate-900 px-6 py-15 text-center text-white shadow-lg">
          <h2 className="font-mono text-4xl font-black md:text-5xl">
            Ready to Start?
          </h2>
          <p className="mt-6 text-xl text-slate-300">
            Set up your first contest in minutes.
          </p>

          <div className="mt-10">
            <Link
              to="/login"
              className="inline-block rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
