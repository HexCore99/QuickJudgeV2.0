import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Settings, LogOut } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { useProfileAvatarUrl } from "../../features/profile/profileAvatar";
import {
  selectProfileHasFetched,
  selectProfileLoading,
  selectProfileUser,
} from "../../features/profile/profileSelectors";
import { fetchProfile } from "../../features/profile/profileThunks";

const MENU_ITEMS = [
  { label: "Profile", to: "/student/profile", Icon: User },
  { label: "Settings", to: "/student/profile?tab=settings", Icon: Settings },
];

const ADMIN_MENU_ITEMS = [
  { label: "Settings", to: "/admin/settings", Icon: Settings },
];

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectProfileUser);
  const hasFetched = useSelector(selectProfileHasFetched);
  const isLoading = useSelector(selectProfileLoading);
  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasRequestedProfileRef = useRef(false);
  const isAdmin = ["admin", "super_admin"].includes(authUser?.role);

  useEffect(() => {
    hasRequestedProfileRef.current = false;
  }, [authUser?.id]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !hasFetched &&
      !isLoading &&
      !hasRequestedProfileRef.current
    ) {
      hasRequestedProfileRef.current = true;
      dispatch(fetchProfile());
    }
  }, [dispatch, hasFetched, isAuthenticated, isLoading]);

  const menuItems = isAdmin ? ADMIN_MENU_ITEMS : MENU_ITEMS;
  const avatarUrl = useProfileAvatarUrl(
    user.avatarUrl,
    user.email || authUser?.email,
    80,
  );

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
        className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-amber-500 bg-slate-100 transition hover:ring-2 hover:ring-amber-300 hover:ring-offset-1 focus:outline-none"
        aria-label="Profile menu"
      >
        <img
          src={avatarUrl}
          alt={authUser?.name || user.name || "Profile"}
          className="h-full w-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right animate-[fadeSlideDown_0.15s_ease] rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
          {menuItems.map((item) => (
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
