function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autocomplete,
}) {
  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          {label}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autocomplete}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />
      </label>
    </div>
  );
}

export default AuthInput;
