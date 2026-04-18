import { ChatsListView } from "../_components/chats-list-view";

/**
 * Recents / Chats list page. Layout: Chats title, New chat button, search, count, list.
 */
export default function ChatRecentsPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <ChatsListView />
    </div>
  );
}
