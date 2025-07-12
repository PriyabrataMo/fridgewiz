"use client";
import { useState } from "react";
import { Message } from "./types";
import MessageList from "./messageList";
import MessageInput from "./messageInput";
import { v4 as uuidv4 } from "uuid";

export default function ChatMainArea() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text: string) => {
    const newMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulate assistant reply
    const reply: Message = {
      id: uuidv4(),
      role: "assistant",
      content: `You said: "${text}". Here's a suggestion based on it...`,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
