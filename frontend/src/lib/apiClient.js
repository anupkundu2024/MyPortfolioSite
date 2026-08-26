/**
 * Thin fetch wrapper for the Express backend.
 *
 * Session handling:
 *  - `credentials: "include"` sends the HTTP-only session cookie, which is the
 *    primary mechanism and the only thing that survives a page reload.
 *  - An access token is additionally kept in this module's memory (never in
 *    localStorage or sessionStorage) and sent as a Bearer header. This is a
 *    fallback for browsers that block cross-site cookies, since the frontend
 *    (Vercel) and backend (Render) are on different sites. It is discarded the
 *    moment the tab is closed or reloaded.
 */

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const buildApiUrl = (path, params) => {
  // Tolerate a relative base (e.g. "/api" behind a same-origin proxy) as well as
  // an absolute one, so `new URL` never throws on a valid configuration.
  const target = `${BASE_URL}${path}`;
  const url = /^https?:\/\//i.test(target)
    ? new URL(target)
    : new URL(target, window.location.origin);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const FALLBACK_MESSAGES = {
  0: "Cannot reach the server. Please check your connection and try again.",
  401: "Unable to authenticate. Please try again.",
  403: "You do not have access to this resource.",
  409: "That email is already registered.",
  429: "Too many attempts. Please wait a few minutes and try again.",
  503: "The service is temporarily unavailable. Please try again shortly.",
};

const messageFor = (status, payload) =>
  payload?.message || FALLBACK_MESSAGES[status] || "Something went wrong. Please try again.";

export const apiRequest = async (path, { method = "GET", body, signal } = {}) => {
  const headers = {};

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ApiError(FALLBACK_MESSAGES[0], 0);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // Non-JSON response (e.g. a proxy error page) — fall through to status handling.
  }

  if (!response.ok) {
    throw new ApiError(messageFor(response.status, payload), response.status);
  }

  return payload?.data ?? payload;
};
