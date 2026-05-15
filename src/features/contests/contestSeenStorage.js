export const CONTEST_SEEN_CHANGE_EVENT = "qj-contest-seen-change";

function getStorage() {
  if (typeof window === "undefined") return null;

  return window.localStorage;
}

function getSeenStorageKey(scope, contestId) {
  return `qj_seen_${scope}_${contestId}`;
}

function getItemId(item) {
  return String(item?.id ?? item?.postedAt ?? item?.createdAt ?? "");
}

export function getSeenContestItemIds(scope, contestId) {
  const storage = getStorage();

  if (!storage || !contestId) return new Set();

  try {
    const rawValue = storage.getItem(getSeenStorageKey(scope, contestId));
    const ids = rawValue ? JSON.parse(rawValue) : [];

    return new Set(Array.isArray(ids) ? ids.map(String) : []);
  } catch {
    return new Set();
  }
}

export function hasUnseenContestItems(scope, contestId, items = []) {
  const seenIds = getSeenContestItemIds(scope, contestId);

  return items.some((item) => {
    const itemId = getItemId(item);

    return itemId && !seenIds.has(itemId);
  });
}

export function markContestItemsSeen(scope, contestId, items = []) {
  const storage = getStorage();

  if (!storage || !contestId || !items.length) return;

  const nextSeenIds = getSeenContestItemIds(scope, contestId);

  items.forEach((item) => {
    const itemId = getItemId(item);

    if (itemId) {
      nextSeenIds.add(itemId);
    }
  });

  storage.setItem(
    getSeenStorageKey(scope, contestId),
    JSON.stringify([...nextSeenIds]),
  );

  window.dispatchEvent(
    new CustomEvent(CONTEST_SEEN_CHANGE_EVENT, {
      detail: { scope, contestId },
    }),
  );
}
