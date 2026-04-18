import { revalidateTag } from "next/cache.js";
import type { CollectionAfterChangeHook } from "payload";

export const revalidatePosts: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { payload, url, context },
}) => {
  // Skip revalidation if we're in the admin panel (during render)
  // The admin panel triggers hooks during render which causes the error
  const isAdminPanel = url?.includes("/admin") || context?.isAdminPanel;

  if (isAdminPanel) {
    payload.logger.info(`Skipping revalidation during admin panel render`);
    return doc;
  }

  try {
    payload.logger.info(`Revalidating posts collection`);
    revalidateTag("posts");
    revalidateTag("blog");
  } catch (error) {
    // Silently fail if revalidation is called during render
    // This can happen when the admin panel renders
    payload.logger.warn(`Could not revalidate posts (may be during render): ${error}`);
  }

  return doc;
};
