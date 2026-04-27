import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Settings, LogOut } from "lucide-react";
import { logout } from "../../features/auth/authSlice";

const MENU_ITEMS = [
  { label: "Profile",  to: "/student/profile", Icon: User     },
  { label: "Settings", to: "/student/settings", Icon: Settings },
];

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="h-10 w-10 cursor-pointer rounded-full border-2 border-amber-500 bg-[radial-gradient(circle_at_35%_30%,#d6d3d1,#78716c_45%,#1f2937_100%)] transition hover:ring-2 hover:ring-amber-300 hover:ring-offset-1 focus:outline-none"
        aria-label="Profile menu"
      />

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right animate-[fadeSlideDown_0.15s_ease] rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg"
        >
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <item.Icon className="h-4 w-4 text-slate-400" />
              {item.label}
            </Link>
          ))}

          <div className="mx-3 my-1.5 border-t border-slate-100" />

          <button
            onClick={() => {
              setOpen(false);
              dispatch(logout());
              navigate("/login", { replace: true });
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
