const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function parseResponse(resp) {
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export async function signupApi(payload) {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function loginApi(payload) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}
