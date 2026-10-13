"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { useBlogPosts } from "@/lib/store";
import type { BlogPost } from "@/lib/content";

const sharp = { borderRadius: 0 } as const;

export function BlogPage() {
  const all = useBlogPosts();
  const { navigateToBlogPost, navigate } = useRouter();
  const { t, formatDate } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);

  const posts = all.filter((p) => p.published);
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[480px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src={featured?.coverImage ?? "https://sfile.chatglm.cn/images-ppt/e9781ad7f905.jpg"}
            alt={featured?.title ?? "Safari landscape"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/55" />
        </motion.div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="font-eyebrow text-gold-soft mb-8 tracking-[0.4em]"
          >
            {t("blog.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            {t("blog.heading1")} <span className="italic text-gold-soft">{t("blog.heading2")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-8 leading-relaxed"
          >
            {t("blog.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* ====================== FEATURED POST ====================== */}
      {featured && (
        <section className="py-16 md:py-24 px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">{t("blog.featuredPost")}</p>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <button
                onClick={() => navigateToBlogPost(featured.id)}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center w-full text-left"
              >
                <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden bg-bone card-zoom" style={sharp}>
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover img-luxury"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="font-eyebrow text-charcoal bg-cream/95 backdrop-blur-sm px-3 py-1.5" style={sharp}>
                      {featured.category}
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-xs text-charcoal/50 mb-3 font-eyebrow tracking-wider">
                    {formatDate(featured.publishedDate)} · {featured.readTimeMins} {t("blog.minRead")}
                  </p>
                  <h2
                    className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal tracking-tight leading-[1.05] mb-4 group-hover:text-forest transition-colors duration-500"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-charcoal/70 leading-relaxed text-base md:text-lg mb-6 line-clamp-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    {featured.authorAvatar && (
                      <img
                        src={featured.authorAvatar}
                        alt={featured.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div className="leading-none">
                      <p className="text-sm text-charcoal font-medium">{featured.author}</p>
                      {featured.authorRole && (
                        <p className="text-xs text-charcoal/55 mt-1">{featured.authorRole}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-6 font-eyebrow text-gold inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-500">
                    {t("blog.readArticle")}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </div>
              </button>
            </Reveal>
          </div>
        </section>
      )}

      {/* ====================== LATEST POSTS GRID ====================== */}
      <section className="pb-16 md:pb-24 px-6 md:px-10 bg-bone/40">
        <div className="mx-auto max-w-[1400px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6 pt-16 md:pt-24">{t("blog.latestPosts")}</p>
          </Reveal>

          {rest.length === 0 ? (
            <div className="text-center py-20">
              <p
                className="font-display text-3xl text-charcoal/60 mb-3"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {t("blog.noPosts")}
              </p>
              <p className="text-sm text-charcoal/55">{t("blog.noPostsSubtitle")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-16 md:pb-24">
              {rest.map((post, idx) => (
                <Reveal key={post.id} variant="up" delay={(idx % 3) * 0.08}>
                  <BlogCard post={post} onOpen={() => navigateToBlogPost(post.id)} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="text-center pb-8">
            <button onClick={() => navigate("contact")} className="btn-luxury">
              {t("cta.contactSpecialist")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===================== Blog Card ===================== */
function BlogCard({ post, onOpen }: { post: BlogPost; onOpen: () => void }) {
  const { t, formatDate } = useLang();
  return (
    <article
      onClick={onOpen}
      className="bg-alabaster border border-border/60 overflow-hidden flex flex-col group card-luxury cursor-pointer h-full"
      style={sharp}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bone card-zoom">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover img-luxury"
        />
        <div className="absolute top-3 left-3">
          <span className="font-eyebrow text-charcoal bg-cream/95 backdrop-blur-sm px-3 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase" style={sharp}>
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <p className="text-xs text-charcoal/50 mb-3 font-eyebrow tracking-wider">
          {formatDate(post.publishedDate)} · {post.readTimeMins} {t("blog.minRead")}
        </p>
        <h3
          className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-3 leading-[1.1] group-hover:text-forest transition-colors duration-500"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {post.title}
        </h3>
        <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-3 mb-5 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          {post.authorAvatar && (
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <span className="text-xs text-charcoal/60">{post.author}</span>
        </div>
      </div>
    </article>
  );
}
