// =====================================================================
// URL slug utilities — convert blog post titles to SEO-friendly URLs.
// ---------------------------------------------------------------------
// e.g. "Gorilla Trekking in Rwanda: A Quiet Conversation" →
//      "gorilla-trekking-in-rwanda-a-quiet-conversation"
//
// The slug is derived ONLY from the title. To handle the rare case of
// two posts with the same title, we append a short hash of the post ID
// (first 6 chars after the prefix). This keeps URLs readable AND unique
// without requiring a `slug` column in the database.
// =====================================================================

import type { BlogPost } from "@/lib/content";

/**
 * Convert any string to a URL-safe slug.
 * - lowercase
 * - replace spaces with hyphens
 * - remove non-alphanumeric chars (except hyphens)
 * - collapse multiple hyphens
 * - trim leading/trailing hyphens
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    // Normalize unicode (e.g. é → e, ñ → n) when supported
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Drop any character that's not a-z, 0-9, space, or hyphen
    .replace(/[^a-z0-9\s-]/g, "")
    // Collapse whitespace → single hyphen
    .replace(/\s+/g, "-")
    // Collapse multiple hyphens
    .replace(/-+/g, "-")
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Build the canonical slug for a blog post.
 *
 * Format: `{slugified-title}-{short-id-hash}`
 *
 * The short ID hash (6 chars) is appended to guarantee uniqueness even
 * if two posts share the same title. We strip common ID prefixes like
 * "blog-" so the result is clean.
 *
 * Examples:
 *   id="blog-gorilla-trekking-guide", title="Gorilla Trekking in Rwanda"
 *     → "gorilla-trekking-in-rwanda-gorilla"
 *
 *   id="blog-mvulwn92-k9y1kw", title="Rwenzori Marathon 2027 Uganda Safari"
 *     → "rwenzori-marathon-2027-uganda-safari-mvulwn"
 */
export function blogPostSlug(post: { id: string; title: string }): string {
  const titleSlug = slugify(post.title);
  // Strip prefixes like "blog-" from the ID, then take the first
  // alphanumeric token (6+ chars) as the uniqueness suffix.
  const idStripped = post.id
    .replace(/^blog-/i, "")
    .replace(/-/g, "");
  const idSuffix = idStripped.slice(0, 6).toLowerCase();

  if (!titleSlug) {
    // Title had no usable characters — fall back to just the ID.
    return `post-${idStripped.slice(0, 12) || "untitled"}`;
  }
  return idSuffix ? `${titleSlug}-${idSuffix}` : titleSlug;
}

/**
 * Find a blog post by its slug.
 *
 * Tries exact match on the canonical slug first. If that fails, tries
 * matching just the title-slug portion (without the ID suffix) — useful
 * for hand-typed URLs where the user omitted the suffix.
 *
 * Returns the post if found, undefined otherwise.
 */
export function findPostBySlug(
  posts: BlogPost[],
  slug: string,
): BlogPost | undefined {
  if (!slug) return undefined;

  // 1. Exact canonical-slug match
  const exact = posts.find((p) => blogPostSlug(p) === slug);
  if (exact) return exact;

  // 2. Title-slug-only match (lenient — first one wins)
  const byTitle = posts.find((p) => slugify(p.title) === slug);
  if (byTitle) return byTitle;

  // 3. Title-slug prefix match — if the URL slug starts with the
  // post's title-slug, treat it as a match (handles cases where the
  // ID suffix differs slightly).
  const byPrefix = posts.find((p) => {
    const t = slugify(p.title);
    return t && (slug === t || slug.startsWith(`${t}-`));
  });
  return byPrefix;
}
