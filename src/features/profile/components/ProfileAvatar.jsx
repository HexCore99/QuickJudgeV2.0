import { useState } from "react";
import { Pencil, Upload, X } from "lucide-react";

const DEFAULT_AVATAR = "https://picsum.photos/seed/student42/300/300.jpg";

export default function ProfileAvatar({ name, initialSrc = DEFAULT_AVATAR }) {
  const [avatarSrc, setAvatarSrc] = useState(initialSrc);
  const [previewSrc, setPreviewSrc] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  function closeUploadModal() {
    setIsUploadOpen(false);
    setPreviewSrc("");
  }

  function handleSaveImage() {
    if (previewSrc) {
      setAvatarSrc(previewSrc);
    }

    closeUploadModal();
  }

  return (
    <>
      <div
        className="relative h-[120px] w-[120px] shrink-0 rounded-full p-[3px]"
        style={{
          background:
            "conic-gradient(#c2850a 0deg, #c2850a 260deg, rgba(0,0,0,0.06) 260deg, rgba(0,0,0,0.06) 360deg)",
        }}
      >
        <img
          src={avatarSrc}
          alt={name}
          className="h-full w-full rounded-full border-[3px] border-white object-cover"
        />
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="absolute right-0.5 bottom-0.5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-amber-600 text-white transition hover:bg-amber-700"
          aria-label="Upload profile image"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>

      {isUploadOpen && (
        <div
          className="fixed inset-0 z-[920] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          onClick={closeUploadModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">
                Upload Profile Image
              </h3>
              <button
                type="button"
                onClick={closeUploadModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close image upload"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 flex justify-center">
              <img
                src={previewSrc || avatarSrc}
                alt={`${name} preview`}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow"
              />
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-5 text-center text-sm text-slate-600 transition hover:border-amber-500 hover:bg-amber-50">
              <Upload className="mb-2 h-5 w-5 text-amber-600" />
              Choose image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeUploadModal}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveImage}
                disabled={!previewSrc}
                className="flex-1 rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
