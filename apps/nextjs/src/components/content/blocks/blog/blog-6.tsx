"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { SectionWrapper } from "../section-wrapper";

interface BlogPost {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  content?: {
    description?: string | null;
    summary?: string | null;
    image?: { image?: { url?: string; alt?: string } | string | null };
  } | null;
  date?: string | null;
}

interface Blog6Props {
  block: {
    blockType: "blog-6";
    badge?: string | null;
    title?: string | null;
    subtitle?: string | null;
    viewAllText?: string | null;
    viewAllLink?: string | null;
    posts?: BlogPost[] | null;
    maxPosts?: number | null;
    [key: string]: unknown;
  };
}

function getImageUrl(img: { url?: string } | string | null | undefined): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url ?? null;
}

export function Blog6({ block }: Blog6Props) {
  const allPosts = block.posts ?? [];
  const posts = block.maxPosts ? allPosts.slice(0, block.maxPosts) : allPosts;

  return (
    <SectionWrapper>
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          className="flex flex-col items-center gap-8 sm:gap-12 xl:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
        >
          <motion.div
            className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row sm:items-end"
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
              {block.badge && (
                <div className="flex items-center gap-2 rounded-full border px-5 py-1">
                  <span className="bg-primary inline-block h-1 w-1 rounded-full" />
                  <span className="text-xs font-bold uppercase">{block.badge}</span>
                </div>
              )}
              {block.title && (
                <h2 className="m-0 px-4 text-2xl font-bold lg:text-3xl xl:text-4xl">
                  {block.title}
                </h2>
              )}
            </div>
            {block.viewAllText && block.viewAllLink && (
              <Link
                href={block.viewAllLink}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors lg:text-base"
              >
                <span>{block.viewAllText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>

          <motion.div
            className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            {posts.map((post, i) => {
              const imgUrl = getImageUrl(post.content?.image?.image);
              const slug = post.slug ?? post.id;
              const description = post.content?.description ?? post.content?.summary;

              return (
                <article
                  key={post.id ?? i}
                  className="flex flex-col gap-3 overflow-hidden rounded-xl border p-3"
                >
                  {imgUrl && (
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        alt={post.title ?? ""}
                        src={imgUrl}
                        fill
                      />
                      <Link href={`/blog/${slug}`} className="absolute inset-0" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    {post.title && (
                      <h3 className="m-0 text-lg font-bold">
                        <Link href={`/blog/${slug}`} className="no-underline hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                    )}
                    {description && (
                      <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
                    )}
                    {post.date && (
                      <span className="text-muted-foreground text-xs">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
