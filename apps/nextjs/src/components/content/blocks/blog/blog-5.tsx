"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { SectionWrapper } from "../section-wrapper";

interface BlogPost {
  id?: string;
  title?: string;
  slug?: string;
  date?: string;
}

interface Blog5Props {
  block: {
    blockType: "blog-5";
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

export function Blog5({ block }: Blog5Props) {
  const allPosts = block.posts ?? [];
  const posts = block.maxPosts ? allPosts.slice(0, block.maxPosts) : allPosts;

  return (
    <SectionWrapper>
      <div className="container mx-auto max-w-3xl px-4">
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
          </motion.div>

          <motion.div
            className="w-full divide-y"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
            }}
          >
            {posts.map((post, i) => {
              const slug = post.slug ?? post.id;

              return (
                <motion.article
                  key={post.id ?? i}
                  className="flex items-center justify-between gap-4 py-4 lg:py-5"
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="flex flex-col gap-1">
                    {post.title && (
                      <h3 className="m-0 text-base font-bold lg:text-lg">
                        <Link href={`/blog/${slug}`} className="no-underline hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                    )}
                  </div>
                  {post.date && (
                    <span className="text-muted-foreground flex-shrink-0 text-sm">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  )}
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
                className="text-primary inline-flex items-center gap-2 text-sm font-semibold hover:underline"
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
