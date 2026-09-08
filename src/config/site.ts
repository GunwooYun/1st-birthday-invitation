// URL helpers that respect the deploy base path (project site under /1st-birthday-invitation).
// Astro's import.meta.env.BASE_URL has no trailing slash unless `base` itself ends with one,
// so string concatenation like `${BASE_URL}favicon.svg` silently breaks; always go through these.

const DEV_ORIGIN = 'http://localhost:4321';

/** Base path with exactly one trailing slash, e.g. "/1st-birthday-invitation/" or "/". */
export const basePath: string = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Site-relative path for a file in `public/`, e.g. withBase('favicon.svg') → "/1st-birthday-invitation/favicon.svg". */
export function withBase(path: string): string {
  return `${basePath}${path.replace(/^\/+/, '')}`;
}

/** Absolute URL for a public file or the page itself (path "" → the canonical page URL). */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(withBase(path), site ?? new URL(DEV_ORIGIN)).toString();
}
