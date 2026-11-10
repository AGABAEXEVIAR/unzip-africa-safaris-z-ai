import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";

/**
 * Next.js dynamic route: /blog/{slug}
 *
 * Examples:
 *   /blog/rwenzori-marathon-2027-uganda-safari-mvulwn
 *   /blog/gorilla-trekking-in-rwanda-a-quiet-con-goril
 *
 * The slug is derived from the blog post title (see src/lib/slug.ts).
 * The actual rendering is handled by the client-side router + BlogDetailPage
 * component — but Next.js generates metadata (title, description, OG tags)
 * server-side here so crawlers see proper social-share metadata without
 * needing JS to execute.
 *
 * The OLD /blog-detail?id={postId} URL still works (see
 * src/app/blog-detail/page.tsx for the backward-compat redirect).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Convert the slug back to a human-readable title (capitalize each word).
  const titleFromSlug = decodedSlug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const title = titleFromSlug
    ? `${titleFromSlug} — Unzip Africa Safaris`
    : "Blog — Unzip Africa Safaris";

  const description = `Read "${titleFromSlug}" on the Unzip Africa Safaris blog — bespoke safari stories, planning tips, and field notes from East & Southern Africa.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Unzip Africa Safaris",
      url: `https://unzipafrica.com/blog/${decodedSlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Page() {
  return <PageContent />;
}
