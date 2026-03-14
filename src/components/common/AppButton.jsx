function AppButton({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) {
  const baseClassName =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition";

  const variantClassNames = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary:
      "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    muted: "bg-slate-100 text-slate-400",
  };

  const disabledClassName = disabled ? "cursor-not-allowed opacity-70" : "";

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

export default AppButton;
