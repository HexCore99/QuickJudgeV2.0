const SESSION_EXPIRED_MESSAGE =
  "Session expired because this account logged in somewhere else.";

let interceptorInstalled = false;
let redirecting = false;

function clearStoredSession() {
  localStorage.removeItem("qj_token");
  localStorage.removeItem("qj_user");
}

function getRequestUrl(input) {
  if (typeof input === "string") {
    return input;
  }

  return input?.url || "";
}

function isAuthEndpoint(url) {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.pathname.startsWith("/api/auth/");
  } catch {
    return String(url).includes("/api/auth/");
  }
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

async function shouldForceLogout(response, requestUrl) {
  if (response.status !== 401 || isAuthEndpoint(requestUrl)) {
    return false;
  }

  if (!localStorage.getItem("qj_token")) {
    return false;
  }

  return true;
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
    const requestUrl = getRequestUrl(args[0]);
    const response = await originalFetch(...args);

    if (
      (await isExpiredSessionResponse(response)) ||
      (await shouldForceLogout(response, requestUrl))
    ) {
      forceLogout();
    }

    return response;
  };
}
