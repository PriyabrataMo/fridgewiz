"use client";
import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex border-t px-4 py-3 bg-white">
      <input
        className="flex-1 p-2 border rounded-l-md outline-none"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-violet-600 text-white px-4 rounded-r-md hover:bg-violet-700"
      >
        Send
      </button>
    </form>
  );
}
