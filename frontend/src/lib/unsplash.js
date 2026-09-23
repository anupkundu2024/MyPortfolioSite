/**
 * Helpers for Unsplash (imgix) URLs used by the project cards.
 *
 * - `auto=format` lets the CDN serve AVIF/WebP to browsers that support them.
 * - The srcset offers smaller widths with the SAME aspect ratio (and so the same
 *   crop), so phones stop downloading desktop-sized images.
 * - Widths never exceed the width the original URL asked for (or `maxWidth`),
 *   so no image gets heavier than before.
 */

const isUnsplash = (url) => /(^|\.)unsplash\.com$/.test(new URL(url).hostname);

function withWidth(url, width) {
  const next = new URL(url);
  const originalWidth = Number(next.searchParams.get("w"));
  const originalHeight = Number(next.searchParams.get("h"));

  next.searchParams.set("w", String(width));
  if (originalWidth && originalHeight) {
    next.searchParams.set("h", String(Math.round((width * originalHeight) / originalWidth)));
  }
  next.searchParams.set("auto", "format");
  return next.toString();
}

/**
 * Returns `{ src, srcSet }` for an <img>. Non-Unsplash URLs are returned untouched.
 */
export function responsiveUnsplash(url, widths, { maxWidth = Infinity } = {}) {
  if (!url || !isUnsplash(url)) return { src: url };

  const requested = Number(new URL(url).searchParams.get("w")) || maxWidth;
  const cap = Math.min(requested, maxWidth);
  const candidates = [...new Set(widths.filter((width) => width < cap).concat(cap))]
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  return {
    src: withWidth(url, candidates[candidates.length - 1]),
    srcSet: candidates.map((width) => `${withWidth(url, width)} ${width}w`).join(", "),
  };
}
