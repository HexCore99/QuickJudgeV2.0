import { X } from "lucide-react";
import Input from "../../../components/common/Input";

export default function EditProfileModal({ isOpen, user, onClose, onSave }) {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSave({
      name: formData.get("name").trim(),
      handle: formData.get("handle").trim(),
      dept: formData.get("dept").trim(),
      bio: formData.get("bio").trim(),
      git: formData.get("git").trim(),
    });
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className={`fixed inset-0 z-[900] flex items-center justify-center transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-[90%] max-w-[520px] rounded-2xl border border-amber-600/20 bg-white p-8 shadow-2xl transition-all duration-350 ${
          isOpen ? "scale-100 translate-y-0" : "scale-92 translate-y-5"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Edit Profile</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <form key={isOpen ? "open" : "closed"} onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              defaultValue={user?.name || ""}
            />
            <Input
              label="Handle"
              name="handle"
              defaultValue={user?.handle || ""}
            />
            <Input
              label="Department"
              name="dept"
              defaultValue={user?.dept || ""}
            />
            <Input
              label="Bio"
              name="bio"
              defaultValue={user?.bio || ""}
              multiline
            />
            <Input
              label="GitHub URL"
              name="git"
              type="url"
              defaultValue={user?.git || ""}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
