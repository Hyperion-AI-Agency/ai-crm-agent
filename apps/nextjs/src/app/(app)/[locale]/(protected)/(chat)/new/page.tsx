import { DashboardCopilotWrapper } from "@/components/dashboard/copilot-wrapper";

import { NewChat } from "../_components/new-chat";

export default function NewChatPage() {
  return (
    <DashboardCopilotWrapper>
      <div className="flex h-full w-full flex-col">
        <NewChat />
      </div>
    </DashboardCopilotWrapper>
  );
}
