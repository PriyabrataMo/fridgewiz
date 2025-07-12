import { Message } from "../types";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  return (
    <div
      className={`p-3 rounded-lg mb-2 max-w-xl ${message.role === "user" ? "bg-gray-100 self-end" : "bg-violet-100 self-start"}`}
    >
      <p className="text-sm text-gray-800 whitespace-pre-wrap">
        {message.content}
      </p>
    </div>
  );
}
