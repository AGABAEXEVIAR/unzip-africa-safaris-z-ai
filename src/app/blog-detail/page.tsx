"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageContent } from "@/components/PageContent";
import { getState } from "@/lib/store";
import { blogPostSlug } from "@/lib/slug";

/**
 * Backward-compatibility redirect: /blog-detail?id={postId} → /blog/{slug}
 *
 * Google and external sites may still have the old URL format indexed.
 * When a user lands on /blog-detail?id=blog-xxx, we look up the post,
 * compute its slug, and redirect to the new clean URL with a 301-style
 * client-side replace (no extra history entry).
 *
 * If the post can't be found (deleted, invalid id), we fall back to
 * rendering the PageContent which will show the "Post not found" state.
 */
export default function Page() {
  const nextRouter = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    const post = getState().blogPosts.find((p) => p.id === id);
    if (post) {
      const slug = blogPostSlug(post);
      // replace() = no extra history entry, prevents back-button trap
      nextRouter.replace(`/blog/${encodeURIComponent(slug)}`);
    }
  }, [id, nextRouter]);

  // While the redirect is pending, render the PageContent so the user
  // sees something. Once the redirect fires, this unmounts.
  return <PageContent />;
}
