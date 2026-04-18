import { ReactNode } from "react";

import { RefreshRouteOnSave } from "@/components/providers/live-preview-provider";

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <RefreshRouteOnSave />
      {children}
    </div>
  );
}
