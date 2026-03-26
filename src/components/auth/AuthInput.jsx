import { useState } from "react";

function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autocomplete,
}) {
  const isPasswordInput = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType = isPasswordInput && isPasswordVisible ? "text" : type;

  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          {label}
        </span>

        <div className="relative">
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autocomplete}
            className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white ${
              isPasswordInput ? "pr-20" : ""
            }`}
          />

          {isPasswordInput ? (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute inset-y-0 right-3 my-auto h-fit text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          ) : null}
        </div>
      </label>
    </div>
  );
}

export default AuthInput;
