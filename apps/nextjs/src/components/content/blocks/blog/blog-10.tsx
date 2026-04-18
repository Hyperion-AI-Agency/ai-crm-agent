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

interface Blog10Props {
  block: {
    blockType: "blog-10";
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

export function Blog10({ block }: Blog10Props) {
  const allPosts = block.posts ?? [];
  const posts = block.maxPosts ? allPosts.slice(0, block.maxPosts) : allPosts;

  return (
    <SectionWrapper>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 sm:gap-12 xl:gap-16">
          <motion.div
            className="flex flex-col items-center gap-3 text-center xl:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
          >
            {block.badge && (
              <motion.div
                className="flex items-center gap-2 rounded-full border px-5 py-1"
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <span className="bg-primary inline-block h-1 w-1 rounded-full" />
                <span className="text-xs font-bold uppercase">{block.badge}</span>
              </motion.div>
            )}
            {block.title && (
              <motion.h2
                className="m-0 px-4 text-2xl font-bold lg:text-3xl xl:text-4xl"
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {block.title}
              </motion.h2>
            )}
            {block.subtitle && (
              <motion.p
                className="text-muted-foreground max-w-2xl text-base xl:text-lg"
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {block.subtitle}
              </motion.p>
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
                  className="bg-card group relative flex flex-col overflow-hidden rounded-xl border transition-shadow duration-300 hover:shadow-lg"
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {imgUrl && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={post.title ?? ""}
                        src={imgUrl}
                        fill
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                    </div>
                  )}

                  {block.badge && (
                    <div className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-3 py-0.5 text-xs font-semibold">
                      {block.badge}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col gap-2 p-4 lg:p-5">
                    {post.date && (
                      <span className="text-muted-foreground text-xs">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    )}
                    {post.title && (
                      <h3 className="group-hover:text-primary m-0 text-lg font-bold transition-colors">
                        <Link href={`/blog/${slug}`} className="no-underline">
                          {post.title}
                        </Link>
                      </h3>
                    )}
                    {description && (
                      <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {block.viewAllText && block.viewAllLink && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <Link
                href={block.viewAllLink}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors lg:text-base"
              >
                <span>{block.viewAllText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
