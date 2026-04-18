"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { SectionWrapper } from "../section-wrapper";

interface BlogPost {
  id?: string;
  title?: string;
  slug?: string;
  content?: {
    description?: string;
    summary?: string;
    image?: { image?: { url?: string; alt?: string } | string | null };
  };
  date?: string;
}

interface Blog7Props {
  block: {
    blockType: "blog-7";
    badge?: string | null;
    title?: string | null;
    subtitle?: string | null;
    posts?: BlogPost[] | null;
    maxPosts?: number | null;
    viewAllText?: string | null;
    viewAllLink?: string | null;
    [key: string]: unknown;
  };
}

function getImageUrl(img: { url?: string } | string | null | undefined): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url ?? null;
}

export function Blog7({ block }: Blog7Props) {
  const allPosts = block.posts ?? [];
  const posts = block.maxPosts ? allPosts.slice(0, block.maxPosts) : allPosts;

  return (
    <SectionWrapper className="bg-zinc-900 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 sm:gap-12 xl:gap-16">
          <motion.div
            className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row sm:items-end"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
          >
            <motion.div
              className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left"
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {block.badge && (
                <div className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-1">
                  <span className="bg-primary inline-block h-1 w-1 rounded-full" />
                  <span className="text-xs font-bold uppercase">{block.badge}</span>
                </div>
              )}
              {block.title && (
                <h2 className="m-0 text-2xl font-bold lg:text-3xl xl:text-4xl">{block.title}</h2>
              )}
            </motion.div>
            {block.viewAllText && block.viewAllLink && (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Link
                  href={block.viewAllLink}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white/90"
                >
                  <span>{block.viewAllText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
            }}
          >
            {posts.map((post, i) => {
              const imgUrl = getImageUrl(post.content?.image?.image);
              const slug = post.slug ?? post.id;
              const description = post.content?.description ?? post.content?.summary;

              return (
                <motion.article
                  key={post.id ?? i}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {imgUrl && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        alt={post.title ?? ""}
                        src={imgUrl}
                        fill
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4 lg:p-5">
                    {post.date && (
                      <span className="text-xs text-white/50">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    )}
                    {post.title && (
                      <h3 className="m-0 text-lg font-bold text-white">
                        <Link href={`/blog/${slug}`} className="no-underline hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                    )}
                    {description && (
                      <p className="line-clamp-2 text-sm text-white/60">{description}</p>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
