/**
 * Canonical origin for the published portfolio.
 *
 * Kept in one place because the domain was previously hardcoded across
 * layout.tsx, page.tsx, sitemap.ts, robots.ts and the OG routes, which is how
 * the stale `klebervinicius.dev` survived the move to `klebervinicius.tech`.
 *
 * Override with NEXT_PUBLIC_SITE_URL for preview deployments.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.klebervinicius.tech"
).replace(/\/$/, "");

export const SITE_NAME = "Kleber Vinicius Portfolio";

/** Locales the app publishes, mirroring middleware.ts. */
export const LOCALES = ["en", "pt-br"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Absolute URL for the dynamic OG image.
 * Absolute (not relative) because WhatsApp and Facebook crawlers refuse
 * to resolve relative og:image values.
 */
export function ogImageUrl(title: string, subtitle: string): string {
  const params = new URLSearchParams({ title, subtitle });
  return `${SITE_URL}/api/og?${params.toString()}`;
}
