function AppTextInput({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-xl border-2 border-slate-300 px-4 py-4 text-lg transition outline-none focus:border-slate-700 ${className}`}
    />
  );
}

export default AppTextInput;
