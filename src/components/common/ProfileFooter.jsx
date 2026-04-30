function ProfileFooter() {
  return (
    <footer className="mt-12 border-t border-black/7 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-slate-500 md:flex-row">
        <span>QuickJudge V2.0 {"\u2014"} Built for competitive learners</span>
        <div className="flex gap-4">
          <a href="#" className="transition-colors hover:text-slate-800">
            Documentation
          </a>
          <a href="#" className="transition-colors hover:text-slate-800">
            API
          </a>
          <a href="#" className="transition-colors hover:text-slate-800">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default ProfileFooter;
