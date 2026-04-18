import { DashboardCopilotWrapper } from "@/components/dashboard/copilot-wrapper";

import { ThreadChat } from "../../_components/thread-chat";

type Props = {
  params: Promise<{ threadId: string }>;
};

export default async function ChatThreadPage({ params }: Props) {
  const { threadId } = await params;
  return (
    <DashboardCopilotWrapper threadId={threadId}>
      <div className="flex h-full w-full flex-col">
        <ThreadChat threadId={threadId} />
      </div>
    </DashboardCopilotWrapper>
  );
}
