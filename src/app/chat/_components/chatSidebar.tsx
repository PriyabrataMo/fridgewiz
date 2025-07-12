import React from "react";

interface ChatSidebarProps {
  conversations: { id: string; name: string }[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  onNewConversation,
}) => {
  return (
    <aside className="w-64 bg-gray-100 h-full flex flex-col border-r">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          onClick={onNewConversation}
          aria-label="New Conversation"
        >
          +
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {conversations.length === 0 && (
          <li className="p-4 text-gray-500 text-center">No conversations</li>
        )}
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${
              selectedId === conv.id ? "bg-blue-200 font-bold" : ""
            }`}
            onClick={() => onSelect(conv.id)}
          >
            {conv.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatSidebar;
