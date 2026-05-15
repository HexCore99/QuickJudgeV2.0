import { Pencil } from "lucide-react";
import { useProfileAvatarUrl } from "../profileAvatar";

export default function ProfileAvatar({ name, email, src, onEditClick }) {
  const avatarUrl = useProfileAvatarUrl(src, email, 300);

  return (
    <div
      className="relative h-[120px] w-[120px] shrink-0 rounded-full p-[3px]"
      style={{
        background: "#c2850a",
      }}
    >
      <img
        src={avatarUrl}
        alt={name}
        className="h-full w-full rounded-full border-[3px] border-white object-cover"
      />
      <button
        type="button"
        onClick={onEditClick}
        className="absolute right-0.5 bottom-0.5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-amber-600 text-white transition hover:bg-amber-700"
        aria-label="Edit profile image"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
