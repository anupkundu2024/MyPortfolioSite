import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

import { config } from "../config/default.js";
import { CvAccessLog } from "../models/CvAccessLog.js";
import { recordCvAccess } from "../services/authService.js";
import { sendSuccess } from "../utils/responseHandler.js";
import { serviceUnavailable } from "../utils/httpErrors.js";
import { signCvTicket } from "../utils/tokens.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * backend/private/ — deliberately outside any static middleware and outside the
 * frontend bundle, so a local PDF is only ever reachable through this controller.
 */
const PRIVATE_DIR = path.resolve(currentDir, "..", "..", "private");

/** How long to wait on the upstream host before giving up, in proxy mode. */
const UPSTREAM_TIMEOUT_MS = 20000;

/** Resolve the local CV path and refuse anything that escapes the private directory. */
const resolveCvPath = () => {
  const target = path.resolve(PRIVATE_DIR, config.cv.fileName);
  const relative = path.relative(PRIVATE_DIR, target);

  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    // Only reachable via a misconfigured CV_FILE_NAME.
    throw serviceUnavailable("The CV is temporarily unavailable.");
  }

  return target;
};

/** Strip anything that could break out of the quoted Content-Disposition value. */
const safeFileName = (name) =>
  String(name || "CV.pdf")
    .replace(/[^\w.\- ]+/g, "_")
    .slice(0, 100) || "CV.pdf";

/**
 * Google Drive share links (`/file/d/<id>/view`) open a viewer *page*, not the
 * file. Map any recognizable Drive URL to the endpoint that returns the bytes.
 * Non-Drive URLs are passed through untouched.
 */
const toDirectFileUrl = (rawUrl) => {
  const driveId =
    rawUrl.match(/\/file\/d\/([\w-]{10,})/)?.[1] ?? rawUrl.match(/[?&]id=([\w-]{10,})/)?.[1];

  return driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : rawUrl;
};

/** The configured external URL, validated. Never sent to the browser. */
const requireExternalUrl = () => {
  const url = config.cv.externalUrl.trim();

  if (!/^https:\/\//i.test(url)) {
    console.error("CV_SOURCE requires an https CV_EXTERNAL_URL, but it is missing or invalid.");
    throw serviceUnavailable("The CV is temporarily unavailable.");
  }

  return url;
};

/** Headers common to every delivery mode. */
const setPdfHeaders = (res, { wantsDownload, fileName, contentLength }) => {
  res.set({
    "Content-Type": "application/pdf",
    // `inline` lets the browser's PDF viewer render it, which still offers
    // download / print / save. `attachment` forces the download dialog.
    "Content-Disposition": `${wantsDownload ? "attachment" : "inline"}; filename="${fileName}"`,
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  });

  if (contentLength) res.set("Content-Length", contentLength);
};

/**
 * Best-effort audit entry. A logging failure must never stop the CV from being
 * delivered, so errors are swallowed after being reported to the server console.
 */
const logAccess = async (user, action) => {
  try {
    await recordCvAccess(user, action);
    await CvAccessLog.create({ userId: user._id, action });
  } catch (error) {
    console.error(`CV access logging failed: ${error.message}`);
  }
};

/**
 * POST /api/cv/ticket — authenticated.
 * Hands the SPA a short-lived token it can put in a new-tab URL.
 */
export const issueCvTicket = async (req, res, next) => {
  try {
    return sendSuccess(
      res,
      {
        ticket: signCvTicket(req.user),
        expiresInSeconds: config.jwt.cvTicketTtlSeconds,
      },
      "CV access granted."
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Stream the CV from an external host through this server.
 *
 * Preferred over a redirect because the visitor's browser never learns the
 * upstream URL — the file stays behind this authenticated endpoint. Falls back
 * to a redirect only if the upstream answer is not actually a PDF (for example
 * Google's "confirm download" interstitial), so the visitor still gets the CV.
 */
const streamExternalCv = async (req, res, { wantsDownload, fileName }) => {
  const externalUrl = requireExternalUrl();
  const directUrl = toDirectFileUrl(externalUrl);

  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), UPSTREAM_TIMEOUT_MS);

  let upstream;
  try {
    upstream = await fetch(directUrl, {
      redirect: "follow",
      signal: abort.signal,
      headers: { Accept: "application/pdf,*/*" },
    });
  } catch (error) {
    clearTimeout(timeout);
    // Never echo the upstream URL back to the client.
    console.error(`CV upstream fetch failed: ${error.message}`);
    throw serviceUnavailable("The CV is temporarily unavailable. Please try again shortly.");
  }

  const contentType = upstream.headers.get("content-type") || "";
  const isPdf = /application\/(pdf|octet-stream)/i.test(contentType);

  if (!upstream.ok || !upstream.body || !isPdf) {
    clearTimeout(timeout);
    upstream.body?.cancel?.().catch(() => {});

    console.warn(
      `CV upstream did not return a PDF (status ${upstream.status}, type "${contentType}") — redirecting instead.`
    );

    // The authorization check has already passed at this point.
    res.set("Cache-Control", "private, no-store");
    return res.redirect(302, directUrl);
  }

  setPdfHeaders(res, {
    wantsDownload,
    fileName,
    // Only trust the upstream length when the body was not compressed in
    // transit. fetch transparently decompresses gzip/br, so a Content-Length
    // measured on the compressed bytes would truncate the response.
    contentLength: upstream.headers.get("content-encoding")
      ? null
      : upstream.headers.get("content-length"),
  });

  // Range requests are not proxied, so don't advertise support for them.
  res.set("Accept-Ranges", "none");

  const body = Readable.fromWeb(upstream.body);

  // If the client disconnects mid-download, stop pulling from upstream.
  res.on("close", () => {
    if (!res.writableEnded) abort.abort();
  });

  body.on("error", (error) => {
    clearTimeout(timeout);
    console.error(`CV stream error: ${error.message}`);
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        message: "The CV could not be delivered. Please try again.",
        timestamp: new Date().toISOString(),
      });
      return;
    }
    res.destroy();
  });

  res.on("finish", () => clearTimeout(timeout));

  return body.pipe(res);
};

/** Stream the CV from backend/private/. */
const streamLocalCv = async (res, next, { wantsDownload, fileName }) => {
  const filePath = resolveCvPath();

  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) throw new Error("not a file");
  } catch {
    // Never surface the filesystem path.
    console.error("CV file is missing or unreadable at the configured location.");
    throw serviceUnavailable("The CV is temporarily unavailable. Please try again later.");
  }

  setPdfHeaders(res, { wantsDownload, fileName });

  // sendFile handles Range requests and streaming. `cacheControl: false` keeps
  // it from replacing the `private, no-store` header set above with its own
  // `public` default; dotfiles are denied.
  return res.sendFile(
    filePath,
    { dotfiles: "deny", acceptRanges: true, cacheControl: false },
    (error) => {
      if (!error) return;
      if (res.headersSent) {
        res.end();
        return;
      }
      next(serviceUnavailable("The CV could not be delivered. Please try again."));
    }
  );
};

/**
 * GET /api/cv — authenticated via session cookie, Bearer token, or CV ticket.
 * Rejected with 401 when none of those verify (see requireCvAccess).
 */
export const getCv = async (req, res, next) => {
  try {
    const wantsDownload = ["1", "true", "yes"].includes(String(req.query.download).toLowerCase());
    const action = wantsDownload ? "cv_download" : "cv_view";
    const fileName = safeFileName(config.cv.downloadName);

    // Range follow-ups from the browser's PDF viewer are not separate accesses.
    if (!req.headers.range) {
      await logAccess(req.user, action);
    }

    if (config.cv.source === "redirect") {
      // Explicitly opted into handing the upstream URL to the browser.
      res.set("Cache-Control", "private, no-store");
      return res.redirect(302, toDirectFileUrl(requireExternalUrl()));
    }

    if (config.cv.source === "proxy") {
      return await streamExternalCv(req, res, { wantsDownload, fileName });
    }

    return await streamLocalCv(res, next, { wantsDownload, fileName });
  } catch (error) {
    return next(error);
  }
};
