import {
  CalendarDays,
  Github,
  GraduationCap,
  IdCard,
  Pencil,
  Share2,
} from "lucide-react";

export default function ProfileInfo({
  user,
  handle,
  bio,
  lastVisit,
  onEditClick,
  onShareClick,
}) {
  return (
    <div className="flex-1 text-center sm:text-left">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          {user.name}
        </h1>
        <p className="mt-1 font-mono text-sm text-slate-500">@{handle}</p>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{bio}</p>
      </div>

      <div className="mb-5 grid gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5 text-amber-600" />
          {user.dept}
        </span>
        <span className="flex items-center gap-1.5">
          <IdCard className="h-3.5 w-3.5 text-amber-600" />
          {user.id}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-amber-600" />
          Registered: {user.joinedDate}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-amber-600" />
          Last visit: {lastVisit}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <button
          onClick={onEditClick}
          className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-amber-700"
        >
          <Pencil className="mr-2 inline h-3.5 w-3.5" />
          Edit Profile
        </button>
        <button
          onClick={onShareClick}
          className="rounded-xl border border-black/7 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          <Share2 className="mr-1.5 inline h-3.5 w-3.5" />
          Share
        </button>
        <a
          href={user.git}
          target="_blank"
          rel="noreferrer"
          className="flex items-center rounded-xl border border-black/7 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          GitHub
        </a>
      </div>
    </div>
  );
}
