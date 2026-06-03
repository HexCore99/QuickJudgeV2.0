export const ADMIN_NAV_TABS = [
  { key: "Dashboard", to: "/admin/dashboard" },
  { key: "Contests", to: "/admin/contests" },
  { key: "Problems", to: "/admin/problems" },
  { key: "Editorials", to: "/admin/editorials" },
];

const SUPER_ADMIN_TABS = [
  { key: "Users", to: "/admin/users" },
  { key: "Logs", to: "/admin/logs" },
];

function getStoredUserRole() {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const userString = localStorage.getItem("qj_user");

  if (!userString) {
    return null;
  }

  try {
    return JSON.parse(userString)?.role || null;
  } catch {
    return null;
  }
}

export function getAdminNavTabs(role, options = {}) {
  const tabs =
    role === "super_admin"
      ? [...ADMIN_NAV_TABS, ...SUPER_ADMIN_TABS]
      : ADMIN_NAV_TABS;

  if (options.end) {
    return tabs.map((tab) => ({ ...tab, end: true }));
  }

  return tabs;
}

export function getCurrentAdminNavTabs(options = {}) {
  return getAdminNavTabs(getStoredUserRole(), options);
}
