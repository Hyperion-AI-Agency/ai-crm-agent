import { revalidateTag } from "next/cache.js";
import type { CollectionAfterChangeHook } from "payload";

export const revalidatePageTemplates: CollectionAfterChangeHook = async ({
  doc,
  req: { payload, url, context },
}) => {
  const isAdminPanel = url?.includes("/admin") || context?.isAdminPanel;

  if (isAdminPanel) {
    payload.logger.info(`Skipping revalidation during admin panel render`);
    return doc;
  }

  try {
    payload.logger.info(`Revalidating page-templates collection`);
    revalidateTag("page-templates");
    revalidateTag("pages");
  } catch (error) {
    payload.logger.warn(`Could not revalidate page-templates: ${error}`);
  }

  return doc;
};
