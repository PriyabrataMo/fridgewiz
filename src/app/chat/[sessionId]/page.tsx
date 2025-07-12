"use client";
import React from "react";

import { useParams } from "next/navigation";

const ChatSessionPage: React.FC = () => {
  const params = useParams();
  const sessionId = params?.sessionId as string | undefined;

  if (!sessionId) {
    return <div>No session ID provided.</div>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Chat Session</h1>
      <p>
        Session ID: <strong>{sessionId}</strong>
      </p>
      {/* Chat UI goes here */}
    </main>
  );
};

export default ChatSessionPage;
