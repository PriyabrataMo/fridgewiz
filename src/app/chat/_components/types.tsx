export type ChatMessage = {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  role: "user" | "assistant" | "system";
};
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date; // Optional, can be used for sorting or display
  attachments?: string[]; // URLs to any attachments like images or files
  metadata?: Record<string, string>; // Additional metadata if needed
};
export type ChatUser = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ChatProps = {
  messages: ChatMessage[];
  currentUser: ChatUser;
  onSendMessage: (message: string) => void;
};
