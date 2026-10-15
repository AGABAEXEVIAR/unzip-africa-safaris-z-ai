/**
 * Builds a Google Maps embed URL from various input formats.
 *
 * Supports:
 * 1. Full embed URL: https://www.google.com/maps/embed?pb=...  → use as-is
 * 2. Regular maps URL: https://www.google.com/maps/place/...   → append &output=embed
 * 3. Short URL: https://maps.app.goo.gl/...                    → append &output=embed (may not work)
 * 4. Coordinates/place name: "Serengeti National Park"        → build query URL
 *
 * If the input is empty, falls back to a query using the destination + park.
 */
export function buildMapEmbedUrl(
  mapEmbed: string | undefined,
  fallbackQuery: string
): string {
  if (!mapEmbed || !mapEmbed.trim()) {
    // Fall back to query format
    return `https://www.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&output=embed`;
  }

  const url = mapEmbed.trim();

  // Already an embed URL — use as-is
  if (url.includes("/maps/embed")) {
    return url;
  }

  // Google Maps URL — append output=embed if not already present
  if (url.includes("google.com/maps") || url.includes("maps.app.goo.gl")) {
    if (url.includes("output=embed")) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}output=embed`;
  }

  // Not a URL — treat as a place name/coordinates
  return `https://www.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
}
