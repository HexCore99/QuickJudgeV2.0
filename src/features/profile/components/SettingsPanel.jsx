import { useState } from "react";
import {
  Github,
  GraduationCap,
  IdCard,
  KeyRound,
  Image,
  Mail,
  Save,
  Upload,
  User,
} from "lucide-react";
import { useProfileAvatarUrl } from "../profileAvatar";

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const LOCAL_AVATAR_PREFIX = "/uploads/avatars/";

function isLocalUploadedAvatarUrl(avatarUrl) {
  return String(avatarUrl || "").startsWith(LOCAL_AVATAR_PREFIX);
}

function getInitialForm(user) {
  const avatarUrl = user?.avatarUrl || "";

  return {
    name: user?.name || "",
    email: user?.email || "",
    dept: user?.dept || "",
    bio: user?.bio || "",
    git: user?.git || "",
    avatarUrl: isLocalUploadedAvatarUrl(avatarUrl) ? "" : avatarUrl,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

export default function SettingsPanel({ user, isSaving, onSave, onToast }) {
  const [form, setForm] = useState(() => getInitialForm(user));
  const [avatarImageData, setAvatarImageData] = useState("");
  const savedLocalAvatarUrl = isLocalUploadedAvatarUrl(user?.avatarUrl)
    ? user.avatarUrl
    : "";
  const avatarPreviewSource = form.avatarUrl || savedLocalAvatarUrl;
  const fallbackAvatarUrl = useProfileAvatarUrl(
    avatarPreviewSource,
    form.email,
    144,
  );
  const avatarPreview = avatarImageData || fallbackAvatarUrl;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAvatarUrlChange(value) {
    updateField("avatarUrl", value);
    setAvatarImageData("");
  }

  function handleAvatarFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onToast?.("Upload an image file only", "error");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      onToast?.("Profile image must be 2 MB or smaller", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = String(reader.result || "");
      setAvatarImageData(imageData);
      setForm((prev) => ({ ...prev, avatarUrl: "" }));
    };
    reader.onerror = () => {
      onToast?.("Failed to read selected image", "error");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const currentEmail = String(user?.email || "")
      .trim()
      .toLowerCase();
    const isEmailChanging = email !== currentEmail;
    const isPasswordChanging = Boolean(
      form.newPassword || form.confirmPassword,
    );

    if ((isEmailChanging || isPasswordChanging) && !form.currentPassword) {
      onToast?.("Current password is required", "error");
      return;
    }

    if (isPasswordChanging && form.newPassword.length < 6) {
      onToast?.("New password must be at least 6 characters", "error");
      return;
    }

    if (isPasswordChanging && form.newPassword !== form.confirmPassword) {
      onToast?.("New password and confirmation do not match", "error");
      return;
    }

    const didSave = await onSave({
      name: form.name.trim(),
      email,
      dept: form.dept.trim(),
      bio: form.bio.trim(),
      git: form.git.trim(),
      avatarUrl: form.avatarUrl.trim() || savedLocalAvatarUrl,
      avatarImageData,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });

    if (didSave) {
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  }

  const inputBase =
    "w-full rounded-xl border border-black/7 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-amber-600/30";

  return (
    <section className="rounded-2xl border border-black/7 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Update your public profile.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-7 lg:grid-cols-[280px_1fr]"
      >
        <div className="rounded-2xl border border-black/7 bg-slate-50 p-5">
          <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
            <img
              src={avatarPreview}
              alt={user?.name || "Profile avatar"}
              className="h-full w-full object-cover"
            />
          </div>

          <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-700">
            <Upload className="h-4 w-4" />
            Upload Image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              onChange={handleAvatarFileChange}
            />
          </label>

          <div className="mt-4">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Image className="h-3.5 w-3.5 text-amber-600" />
              Avatar URL
            </label>
            <input
              type="text"
              value={form.avatarUrl}
              onChange={(event) => handleAvatarUrlChange(event.target.value)}
              placeholder="https://example.com/avatar.png"
              className={inputBase}
            />
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <User className="h-3.5 w-3.5 text-amber-600" />
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputBase}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <IdCard className="h-3.5 w-3.5 text-amber-600" />
                Public ID
              </label>
              <div className="w-full rounded-xl border border-black/7 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-500">
                {user?.id || "--"}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <GraduationCap className="h-3.5 w-3.5 text-amber-600" />
                Department
              </label>
              <input
                type="text"
                value={form.dept}
                onChange={(event) => updateField("dept", event.target.value)}
                className={inputBase}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Mail className="h-3.5 w-3.5 text-amber-600" />
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={inputBase}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Github className="h-3.5 w-3.5 text-amber-600" />
              GitHub URL
            </label>
            <input
              type="url"
              value={form.git}
              onChange={(event) => updateField("git", event.target.value)}
              className={inputBase}
            />
          </div>

          <div className="border-t border-black/5 pt-5">
            <h3 className="mb-4 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <KeyRound className="h-3.5 w-3.5 text-amber-600" />
              Account Security
            </h3>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Current Password
                </label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(event) =>
                    updateField("currentPassword", event.target.value)
                  }
                  className={inputBase}
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  New Password
                </label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(event) =>
                    updateField("newPassword", event.target.value)
                  }
                  className={inputBase}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    updateField("confirmPassword", event.target.value)
                  }
                  className={inputBase}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Bio
            </label>
            <textarea
              rows="5"
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              className={`${inputBase} resize-none`}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
