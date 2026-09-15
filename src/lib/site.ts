export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://aleph-claude.vercel.app"
).replace(/\/$/, "");
export const consentVersion = "2026-09-15-v1";
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
