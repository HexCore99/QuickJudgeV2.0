import { Search } from "lucide-react";

function AppSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  containerClassName = "",
  inputClassName = "",
  iconClassName = "",
  ...props
}) {
  return (
    <div className={`relative ${containerClassName}`}>
      <Search
        className={`pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 ${iconClassName}`}
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-12 w-full rounded-2xl border border-[#dfdcd6] bg-white pr-4 pl-11 text-[14px] text-slate-600 transition outline-none placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70 ${inputClassName}`}
        {...props}
      />
    </div>
  );
}

export default AppSearchInput;
