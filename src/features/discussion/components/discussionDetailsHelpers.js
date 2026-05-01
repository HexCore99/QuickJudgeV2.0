export function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitialColor(name = "") {
  const colors = [
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
  ];
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function buildReplyTree(replies = []) {
  const map = new Map();
  const roots = [];

  for (const reply of replies) {
    map.set(reply.id, { ...reply, children: [] });
  }

  for (const reply of replies) {
    const node = map.get(reply.id);

    if (reply.parentReplyId && map.has(reply.parentReplyId)) {
      map.get(reply.parentReplyId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
