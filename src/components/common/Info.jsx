function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  );
}

export default Info;
