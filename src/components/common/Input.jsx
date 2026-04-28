function Input({
  label,
  name,
  type = "text",
  defaultValue = "",
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  className = "",
  inputClassName = "",
  ...props
}) {
  const fieldClassName =
    "w-full rounded-xl border border-black/7 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-amber-600/30";
  const inputProps = {
    name,
    defaultValue,
    value,
    onChange,
    placeholder,
    className: `${fieldClassName} ${multiline ? "resize-none" : ""} ${inputClassName}`,
    ...props,
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea rows={rows} {...inputProps} />
      ) : (
        <input type={type} {...inputProps} />
      )}
    </div>
  );
}

export default Input;
