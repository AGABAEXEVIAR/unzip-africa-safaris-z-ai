"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/luxury/Reveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { useBlogPosts } from "@/lib/store";

const sharp = { borderRadius: 0 } as const;

export function BlogDetailPage() {
  const all = useBlogPosts();
  const { selectedBlogPostId, navigateToBlogPost, navigate } = useRouter();
  const { t, formatDate } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);

  const post = all.find((p) => p.id === selectedBlogPostId);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center px-6">
          <p
            className="font-display text-3xl text-charcoal mb-4"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Post not found.
          </p>
          <button onClick={() => navigate("blog")} className="btn-luxury btn-luxury-gold">
            {t("blog.backToBlog")}
          </button>
        </div>
      </div>
    );
  }

  const bodyParagraphs = post.body.split(/\n\n+/).filter(Boolean);
  const others = all.filter((p) => p.published && p.id !== post.id).slice(0, 3);
  // Prev/next within published posts (loop)
  const published = all.filter((p) => p.published);
  const idx = published.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? published[idx - 1] : published[published.length - 1];
  const next = idx >= 0 && idx < published.length - 1 ? published[idx + 1] : published[0];

  return (
    <div className="page-enter bg-canvas">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[500px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-charcoal/40" />
        </motion.div>

        <div className="relative h-full flex flex-col justify-between px-6 md:px-10 py-10 md:py-12">
          <button
            onClick={() => navigate("blog")}
            className="flex items-center gap-2 text-cream/80 hover:text-cream transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-eyebrow text-cream/80">{t("blog.backToBlog")}</span>
          </button>

          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="font-eyebrow text-gold-soft mb-5 tracking-[0.4em]"
            >
              {post.category}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-cream text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] leading-[1] tracking-tight mb-6 max-w-[92%]"
              style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
            >
              {post.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-cream/85 text-sm"
            >
              <span className="flex items-center gap-2">
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{t("blog.byAuthor")} {post.author}</span>
              </span>
              <span>·</span>
              <span>{formatDate(post.publishedDate)}</span>
              <span>·</span>
              <span>{post.readTimeMins} {t("blog.minRead")}</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================== ARTICLE BODY ====================== */}
      <article className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          {/* Excerpt as a drop-cap lead */}
          <Reveal variant="up">
            <p
              className="font-display text-xl md:text-2xl leading-relaxed text-charcoal mb-10 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85] first-letter:text-forest"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {post.excerpt}
            </p>
          </Reveal>

          {bodyParagraphs.length === 0 ? (
            <p className="text-charcoal/60 italic">{t("blog.emptyBody")}</p>
          ) : (
            bodyParagraphs.map((para, i) => (
              <Reveal key={i} variant="up" delay={Math.min(i * 0.05, 0.2)}>
                <p className="text-base md:text-lg text-charcoal/85 leading-relaxed mb-6">
                  {para}
                </p>
              </Reveal>
            ))
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <p className="font-eyebrow text-gold mb-3 text-[0.65rem] tracking-[0.25em]">
                {t("blog.tags")}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-charcoal/70 border border-border px-3 py-1.5"
                    style={sharp}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author bio */}
          <div className="mt-12 p-6 md:p-8 bg-alabaster border border-border" style={sharp}>
            <div className="flex items-start gap-4">
              {post.authorAvatar && (
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div>
                <p className="font-display text-xl text-charcoal tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {post.author}
                </p>
                {post.authorRole && (
                  <p className="text-sm text-charcoal/60 mt-1">{post.authorRole}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ====================== PREV / NEXT ====================== */}
      <section className="bg-forest-deep text-cream py-12 md:py-16 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <button
            onClick={() => prev && navigateToBlogPost(prev.id)}
            className="group flex flex-col text-left p-6 md:p-8 border border-cream/15 hover:bg-cream/5 transition-colors"
            style={sharp}
          >
            <span className="font-eyebrow text-cream/60 mb-3 inline-flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" />
              {t("blog.prevArticle")}
            </span>
            <span
              className="font-display text-xl md:text-2xl text-cream group-hover:text-gold-soft transition-colors leading-tight"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {prev?.title}
            </span>
          </button>
          <button
            onClick={() => next && navigateToBlogPost(next.id)}
            className="group flex flex-col text-right p-6 md:p-8 border border-cream/15 hover:bg-cream/5 transition-colors"
            style={sharp}
          >
            <span className="font-eyebrow text-cream/60 mb-3 inline-flex items-center gap-2 ml-auto">
              {t("blog.nextArticle")}
              <ArrowRight className="w-3 h-3" />
            </span>
            <span
              className="font-display text-xl md:text-2xl text-cream group-hover:text-gold-soft transition-colors leading-tight"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {next?.title}
            </span>
          </button>
        </div>
      </section>

      {/* ====================== RELATED POSTS ====================== */}
      {others.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">{t("blog.relatedPosts")}</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {others.map((p, i) => (
                <Reveal key={p.id} variant="up" delay={i * 0.08}>
                  <article
                    onClick={() => navigateToBlogPost(p.id)}
                    className="group cursor-pointer card-luxury bg-alabaster border border-border/60 overflow-hidden flex flex-col h-full"
                    style={sharp}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-bone card-zoom">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover img-luxury"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="font-eyebrow text-charcoal bg-cream/95 backdrop-blur-sm px-3 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase" style={sharp}>
                          {p.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 md:p-6 flex flex-col flex-1">
                      <p className="text-xs text-charcoal/50 mb-3 font-eyebrow tracking-wider">
                        {formatDate(p.publishedDate)} · {p.readTimeMins} {t("blog.minRead")}
                      </p>
                      <h3
                        className="font-display text-xl md:text-2xl text-charcoal tracking-tight mb-3 leading-[1.1] group-hover:text-forest transition-colors"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-2 flex-1">
                        {p.excerpt}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
