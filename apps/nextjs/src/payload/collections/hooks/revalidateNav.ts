import { revalidateTag } from "next/cache.js";
import type { GlobalAfterChangeHook } from "payload";

export const revalidateNav: GlobalAfterChangeHook = ({ doc, req: { payload, url, context } }) => {
  // Skip revalidation if we're in the admin panel (during render)
  const isAdminPanel = url?.includes("/admin") || context?.isAdminPanel;

  if (isAdminPanel) {
    payload.logger.info(`Skipping revalidation during admin panel render`);
    return doc;
  }

  try {
    payload.logger.info(`Revalidating nav`);
    revalidateTag("global_nav");
  } catch (error) {
    payload.logger.warn(`Could not revalidate nav (may be during render): ${error}`);
  }
  return doc;
};
