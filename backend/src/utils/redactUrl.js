/**
 * Redacts credential-bearing query parameters before a URL is written anywhere
 * durable (server logs, error reports).
 *
 * `GET /api/cv?ticket=<jwt>` is the reason this exists: the ticket is a real,
 * if short-lived, access credential, and host log retention would outlive it.
 */
const SENSITIVE_PARAMS = new Set(["ticket", "token", "access_token", "password", "secret"]);

export const redactUrl = (originalUrl = "") => {
  const url = String(originalUrl);
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) return url;

  const path = url.slice(0, queryIndex);

  let params;
  try {
    params = new URLSearchParams(url.slice(queryIndex + 1));
  } catch {
    // Unparseable query — drop it entirely rather than risk logging a secret.
    return `${path}?[unparsed]`;
  }

  for (const key of [...params.keys()]) {
    if (SENSITIVE_PARAMS.has(key.toLowerCase())) params.set(key, "[redacted]");
  }

  const query = params.toString();
  return query ? `${path}?${decodeURIComponent(query)}` : path;
};

export default redactUrl;
