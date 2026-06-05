import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Ban,
  Check,
  ChevronDown,
  Clock,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import {
  selectAdminUsers,
  selectAdminUsersError,
  selectAdminUsersLoading,
  selectAdminUsersMutating,
} from "../../../features/admin/adminUsersSelectors";
import {
  banAdminUserThunk,
  createAdminUserThunk,
  fetchAdminUsers,
  suspendAdminUserThunk,
  unsuspendAdminUserThunk,
} from "../../../features/admin/adminUsersThunks";
import { validateStrongPassword } from "../../../features/auth/passwordRules";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "student", label: "Student" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
];

const SUSPENSION_OPTIONS = [
  { value: "indefinite", label: "Indefinite" },
  { value: "one_hour", label: "1 hour" },
  { value: "twenty_four_hours", label: "24 hours" },
  { value: "seven_days", label: "7 days" },
  { value: "custom", label: "Custom date/time" },
];

const ROLE_BADGE_CLASSES = {
  student: "border-blue-200 bg-blue-50 text-blue-700",
  admin: "border-violet-200 bg-violet-50 text-violet-700",
  super_admin: "border-orange-200 bg-orange-50 text-orange-700",
};

const STATUS_BADGE_CLASSES = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  suspended: "border-amber-200 bg-amber-50 text-amber-700",
  banned: "border-red-200 bg-red-50 text-red-700",
};

const STAT_ACCENTS = {
  blue: {
    card: "border-blue-200/80 bg-blue-50/40 hover:border-blue-300 hover:bg-blue-50/60",
    icon: "bg-blue-100 text-blue-600",
    value: "text-blue-700",
  },
  violet: {
    card: "border-violet-200/80 bg-violet-50/40 hover:border-violet-300 hover:bg-violet-50/60",
    icon: "bg-violet-100 text-violet-600",
    value: "text-violet-700",
  },
  amber: {
    card: "border-amber-200/80 bg-amber-50/40 hover:border-amber-300 hover:bg-amber-50/60",
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-700",
  },
  red: {
    card: "border-red-200/80 bg-red-50/40 hover:border-red-300 hover:bg-red-50/60",
    icon: "bg-red-100 text-red-600",
    value: "text-red-700",
  },
};

const EMPTY_CREATE_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMPTY_SUSPEND_FORM = {
  duration: "indefinite",
  customUntil: "",
  reason: "",
};

const EMPTY_BAN_FORM = {
  confirmEmail: "",
  reason: "",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function getCurrentUser() {
  const userString = localStorage.getItem("qj_user");

  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
}

function formatRole(role) {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : dateFormatter.format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : dateTimeFormatter.format(date);
}

function getDefaultCustomDateTime() {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  const localDate = new Date(
    oneHourFromNow.getTime() - oneHourFromNow.getTimezoneOffset() * 60000,
  );

  return localDate.toISOString().slice(0, 16);
}

function getSuspendedUntil(duration, customUntil) {
  const now = Date.now();
  const durationMap = {
    one_hour: 60 * 60 * 1000,
    twenty_four_hours: 24 * 60 * 60 * 1000,
    seven_days: 7 * 24 * 60 * 60 * 1000,
  };

  if (duration === "indefinite") return null;
  if (duration === "custom") return new Date(customUntil).toISOString();

  return new Date(now + durationMap[duration]).toISOString();
}

function StatCard({ stat }) {
  const accent = STAT_ACCENTS[stat.accent];
  const Icon = stat.Icon;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${accent.card}`}
    >
      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent.icon}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className={`text-3xl font-bold tracking-tight ${accent.value}`}>
        {stat.value}
      </div>
      <div className="mt-0.5 text-[13px] font-medium text-slate-500">
        {stat.label}
      </div>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${className}`}
    >
      {children}
    </span>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-[16px] font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="text-[12px] font-bold tracking-wider text-slate-500 uppercase">
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
    />
  );
}

function SuspensionDurationSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const selectedOption =
    SUSPENSION_OPTIONS.find((option) => option.value === value) ||
    SUSPENSION_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(nextValue) {
    onChange({
      target: {
        name: "duration",
        value: nextValue,
      },
    });
    setIsOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-left text-[13px] font-semibold transition outline-none ${
          isOpen
            ? "border-amber-400 text-slate-900 ring-2 ring-amber-100"
            : "border-slate-200 text-slate-700 hover:border-slate-300"
        }`}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180 text-amber-600" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl ring-1 ring-slate-900/5"
        >
          {SUSPENSION_OPTIONS.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition ${
                  isSelected
                    ? "bg-amber-50 text-amber-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{option.label}</span>
                <Check
                  className={`h-4 w-4 ${
                    isSelected ? "text-amber-600" : "invisible"
                  }`}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function FormError({ children }) {
  if (!children) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
      {children}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed right-5 bottom-5 z-[60] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-700 shadow-lg">
      {message}
    </div>
  );
}

function CreateAdminModal({
  form,
  error,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}) {
  const isDisabled =
    isSubmitting ||
    !form.name.trim() ||
    !form.email.trim() ||
    !form.password ||
    form.password !== form.confirmPassword;

  return (
    <ModalShell title="Create Admin" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <FormError>{error}</FormError>

        <div className="space-y-2">
          <FieldLabel>Name</FieldLabel>
          <TextInput
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Admin name"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <TextInput
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="admin@example.com"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>Password</FieldLabel>
            <TextInput
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Confirm Password</FieldLabel>
            <TextInput
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled}
            className="rounded-xl bg-amber-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function SuspendAccountModal({
  form,
  error,
  isSubmitting,
  selectedUser,
  onChange,
  onClose,
  onSubmit,
}) {
  const needsCustomDate = form.duration === "custom";
  const isDisabled = isSubmitting || (needsCustomDate && !form.customUntil);

  return (
    <ModalShell title="Suspend Account" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <FormError>{error}</FormError>

        <div className="space-y-2">
          <FieldLabel>User Email</FieldLabel>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-semibold text-slate-700">
            {selectedUser.email}
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Suspension Duration</FieldLabel>
          <SuspensionDurationSelect value={form.duration} onChange={onChange} />
        </div>

        {needsCustomDate ? (
          <div className="space-y-2">
            <FieldLabel>Custom Date/Time</FieldLabel>
            <TextInput
              name="customUntil"
              type="datetime-local"
              value={form.customUntil}
              onChange={onChange}
              min={getDefaultCustomDateTime()}
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <FieldLabel>Reason</FieldLabel>
          <textarea
            name="reason"
            value={form.reason}
            onChange={onChange}
            rows={4}
            placeholder="Reason for suspension"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled}
            className="rounded-xl bg-amber-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Suspending..." : "Suspend Account"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function BanAccountModal({
  form,
  isSubmitting,
  selectedUser,
  onChange,
  onClose,
  onSubmit,
}) {
  const canBan =
    !isSubmitting && form.confirmEmail.trim() === selectedUser.email;

  return (
    <ModalShell title="Permanent Ban" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
          This action cannot be undone from the UI.
        </div>

        <div className="space-y-2">
          <FieldLabel>Confirm Email</FieldLabel>
          <TextInput
            name="confirmEmail"
            value={form.confirmEmail}
            onChange={onChange}
            placeholder={selectedUser.email}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Reason</FieldLabel>
          <textarea
            name="reason"
            value={form.reason}
            onChange={onChange}
            rows={4}
            placeholder="Reason for permanent ban"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canBan}
            className="rounded-xl bg-red-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Banning..." : "Permanently Ban"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const currentUserRole = currentUser?.role;
  const users = useSelector(selectAdminUsers);
  const isLoading = useSelector(selectAdminUsersLoading);
  const isMutating = useSelector(selectAdminUsersMutating);
  const error = useSelector(selectAdminUsersError);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [suspendForm, setSuspendForm] = useState(EMPTY_SUSPEND_FORM);
  const [banForm, setBanForm] = useState(EMPTY_BAN_FORM);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (currentUserRole !== "super_admin") {
      return undefined;
    }

    dispatch(fetchAdminUsers());

    const intervalId = window.setInterval(() => {
      dispatch(fetchAdminUsers());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [currentUserRole, dispatch]);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timerId = window.setTimeout(() => setToastMessage(""), 3000);
    return () => window.clearTimeout(timerId);
  }, [toastMessage]);

  const stats = useMemo(
    () => [
      {
        label: "Total Users",
        value: users.length,
        accent: "blue",
        Icon: Users,
      },
      {
        label: "Admins",
        value: users.filter(
          (user) => user.role === "admin" || user.role === "super_admin",
        ).length,
        accent: "violet",
        Icon: ShieldCheck,
      },
      {
        label: "Suspended Accounts",
        value: users.filter((user) => user.status === "suspended").length,
        accent: "amber",
        Icon: Clock,
      },
      {
        label: "Banned Users",
        value: users.filter((user) => user.status === "banned").length,
        accent: "red",
        Icon: Ban,
      },
    ],
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchQuery, statusFilter, users]);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUserRole !== "super_admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  function showToast(message) {
    setToastMessage(message);
  }

  function closeModal() {
    setActiveModal(null);
    setSelectedUser(null);
    setCreateForm(EMPTY_CREATE_FORM);
    setSuspendForm(EMPTY_SUSPEND_FORM);
    setBanForm(EMPTY_BAN_FORM);
    setFormError("");
  }

  function openCreateModal() {
    setCreateForm(EMPTY_CREATE_FORM);
    setFormError("");
    setActiveModal("create");
  }

  function openSuspendModal(user) {
    setSelectedUser(user);
    setSuspendForm({
      ...EMPTY_SUSPEND_FORM,
      customUntil: getDefaultCustomDateTime(),
    });
    setFormError("");
    setActiveModal("suspend");
  }

  function openBanModal(user) {
    setSelectedUser(user);
    setBanForm(EMPTY_BAN_FORM);
    setFormError("");
    setActiveModal("ban");
  }

  function handleCreateFormChange(event) {
    const { name, value } = event.target;
    setFormError("");
    setCreateForm((prevForm) => ({ ...prevForm, [name]: value }));
  }

  function handleSuspendFormChange(event) {
    const { name, value } = event.target;
    setFormError("");
    setSuspendForm((prevForm) => ({ ...prevForm, [name]: value }));
  }

  function handleBanFormChange(event) {
    const { name, value } = event.target;
    setBanForm((prevForm) => ({ ...prevForm, [name]: value }));
  }

  async function handleCreateAdmin(event) {
    event.preventDefault();

    const email = createForm.email.trim().toLowerCase();
    const name = createForm.name.trim();
    const passwordError = validateStrongPassword(createForm.password);

    if (passwordError) {
      setFormError(passwordError);
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await dispatch(
        createAdminUserThunk({
          name,
          email,
          password: createForm.password,
        }),
      ).unwrap();
      closeModal();
      showToast("Admin account created successfully.");
    } catch (actionError) {
      setFormError(actionError || "Failed to create admin.");
    }
  }

  async function handleSuspendAccount(event) {
    event.preventDefault();

    if (!selectedUser) return;

    if (suspendForm.duration === "custom") {
      const customDate = new Date(suspendForm.customUntil);

      if (
        !suspendForm.customUntil ||
        Number.isNaN(customDate.getTime()) ||
        customDate.getTime() <= Date.now()
      ) {
        setFormError("Choose a future date and time.");
        return;
      }
    }

    const suspendedUntil = getSuspendedUntil(
      suspendForm.duration,
      suspendForm.customUntil,
    );

    try {
      await dispatch(
        suspendAdminUserThunk({
          userId: selectedUser.id,
          suspendedUntil,
          reason: suspendForm.reason.trim(),
        }),
      ).unwrap();
      closeModal();
      showToast("Account suspended successfully.");
    } catch (actionError) {
      setFormError(actionError || "Failed to suspend account.");
    }
  }

  async function handleUnsuspend(userId) {
    try {
      await dispatch(unsuspendAdminUserThunk(userId)).unwrap();
      showToast("Account restored successfully.");
    } catch (actionError) {
      showToast(actionError || "Failed to restore account.");
    }
  }

  async function handleBanAccount(event) {
    event.preventDefault();

    if (!selectedUser) return;

    try {
      await dispatch(
        banAdminUserThunk({
          userId: selectedUser.id,
          reason: banForm.reason.trim(),
        }),
      ).unwrap();
      closeModal();
      showToast("Account banned permanently.");
    } catch (actionError) {
      setFormError(actionError || "Failed to ban account.");
    }
  }

  function renderActions(user) {
    if (user.role === "super_admin") {
      return (
        <span className="text-[12px] font-semibold text-amber-700">
          Protected
        </span>
      );
    }

    if (user.status === "banned") {
      return (
        <span className="text-[12px] font-semibold text-slate-400">
          No actions
        </span>
      );
    }

    return (
      <div className="flex flex-wrap justify-end gap-2">
        {user.status === "suspended" ? (
          <button
            type="button"
            disabled={isMutating}
            onClick={() => handleUnsuspend(user.id)}
            className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Restore
          </button>
        ) : (
          <button
            type="button"
            disabled={isMutating}
            onClick={() => openSuspendModal(user)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Suspend
          </button>
        )}

        <button
          type="button"
          disabled={isMutating}
          onClick={() => openBanModal(user)}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Ban
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={getCurrentAdminNavTabs()}
          logoTo="/"
          navExtra={<AdminMoreMenu />}
        />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Users & Access
              </h1>
              <p className="mt-1 text-[14px] text-slate-500">
                Manage students, admins, suspensions, timed restrictions, and
                permanent bans.
              </p>
            </div>

            <button
              type="button"
              disabled={isMutating}
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              Create Admin
            </button>
          </div>

          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-4 pl-10 text-[13px] transition outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                  <Filter className="h-4 w-4 text-slate-400" />
                  Filters
                </div>

                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-semibold text-slate-600 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-semibold text-slate-600 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={isMutating}
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  Create Admin
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      User
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[13px] text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading &&
                    !error &&
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-bold text-slate-600">
                              {user.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="text-[14px] font-semibold text-slate-800">
                                {user.name}
                              </div>
                              <div className="text-[12px] text-slate-400">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] font-medium text-slate-600">
                          {user.email}
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={ROLE_BADGE_CLASSES[user.role]}>
                            {formatRole(user.role)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <Badge
                              className={STATUS_BADGE_CLASSES[user.status]}
                            >
                              {formatStatus(user.status)}
                            </Badge>
                            {user.status === "suspended" ? (
                              <span className="text-[11px] font-medium text-slate-400">
                                {user.suspendedUntil
                                  ? `Until ${formatDateTime(user.suspendedUntil)}`
                                  : "Indefinite"}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] font-medium text-slate-500">
                          {formatDate(user.joinedAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {renderActions(user)}
                        </td>
                      </tr>
                    ))}

                  {!isLoading && !error && filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[13px] text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {activeModal === "create" ? (
        <CreateAdminModal
          form={createForm}
          error={formError}
          isSubmitting={isMutating}
          onChange={handleCreateFormChange}
          onClose={closeModal}
          onSubmit={handleCreateAdmin}
        />
      ) : null}

      {activeModal === "suspend" && selectedUser ? (
        <SuspendAccountModal
          form={suspendForm}
          error={formError}
          isSubmitting={isMutating}
          selectedUser={selectedUser}
          onChange={handleSuspendFormChange}
          onClose={closeModal}
          onSubmit={handleSuspendAccount}
        />
      ) : null}

      {activeModal === "ban" && selectedUser ? (
        <BanAccountModal
          form={banForm}
          isSubmitting={isMutating}
          selectedUser={selectedUser}
          onChange={handleBanFormChange}
          onClose={closeModal}
          onSubmit={handleBanAccount}
        />
      ) : null}

      <Toast message={toastMessage} />
    </div>
  );
}
