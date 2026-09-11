/*
 BACKEND INTEGRATION
 -------------------
 Keep all frontend → backend requests in this helper.

 Suggested endpoints:
 POST /api/auth/signup
 POST /api/auth/signin
 POST /api/auth/signout
 GET  /api/auth/me
 POST /api/auth/forgot-password
 POST /api/auth/reset-password
 POST /api/calculations
 GET  /api/calculations

 Recommended auth design:
 - Backend creates an httpOnly + Secure session cookie.
 - Frontend sends credentials: "include".
 - Never store passwords or long-lived auth tokens in localStorage.

 Set VITE_API_URL when the backend is deployed.
*/

const API_URL = import.meta.env.VITE_API_URL || "";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}
