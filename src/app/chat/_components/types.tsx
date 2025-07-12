export type ChatMessage = {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  role: "user" | "assistant" | "system";
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
