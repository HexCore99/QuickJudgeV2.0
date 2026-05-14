const SESSION_EXPIRED_MESSAGE =
  "Session expired because this account logged in somewhere else.";

let interceptorInstalled = false;
let redirecting = false;

function clearStoredSession() {
  localStorage.removeItem("qj_token");
  localStorage.removeItem("qj_user");
}

async function isExpiredSessionResponse(response) {
  if (response.status !== 401) {
    return false;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return false;
  }

  try {
    const data = await response.clone().json();
    return data?.message === SESSION_EXPIRED_MESSAGE;
  } catch {
    return false;
  }
}

function forceLogout() {
  if (redirecting) {
    return;
  }

  redirecting = true;
  clearStoredSession();

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

export function installSessionExpiryInterceptor() {
  if (interceptorInstalled || typeof window === "undefined") {
    return;
  }

  interceptorInstalled = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (await isExpiredSessionResponse(response)) {
      forceLogout();
    }

    return response;
  };
}
