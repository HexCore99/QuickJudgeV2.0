function Button({
  children,
  type = "button",
  variant = "primary",
  active = false,
  disabled = false,
  className = "",
  ...props
}) {
  const baseClassName =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 active:scale-[0.98]";

  const variantClassNames = {
    primary:
      "bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md",
    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50",
    muted: "bg-slate-100 text-slate-400 hover:bg-slate-100",
    plain: "",
    filter: active
      ? "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-700 shadow-sm hover:bg-amber-50"
      : "rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800",
    segmented: active
      ? "rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm"
      : "rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900",
  };

  const disabledClassName = disabled
    ? "cursor-not-allowed opacity-60 shadow-none active:scale-100"
    : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClassName} ${variantClassNames[variant]} ${disabledClassName} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
