import { revalidateTag } from "next/cache.js";
import type { CollectionAfterChangeHook } from "payload";

export const revalidatePages: CollectionAfterChangeHook = async ({
  doc,
  req: { payload, url, context },
}) => {
  const isAdminPanel = url?.includes("/admin") || context?.isAdminPanel;

  if (isAdminPanel) {
    payload.logger.info(`Skipping revalidation during admin panel render`);
    return doc;
  }

  try {
    payload.logger.info(`Revalidating pages collection`);
    revalidateTag("pages");
  } catch (error) {
    payload.logger.warn(`Could not revalidate pages (may be during render): ${error}`);
  }

  return doc;
};
