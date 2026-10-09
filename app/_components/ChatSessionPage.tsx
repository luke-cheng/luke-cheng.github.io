"use client";

import { usePortfolioAiState } from "@/app/_components/PortfolioAiContext";

function ChatSessionPage() {
  const ai = usePortfolioAiState();

  return (
    <main className={`chat-page ${ai.hasChatted ? "is-active" : "is-idle"}`}>
      {!ai.hasChatted && (
        <section
          className="chat-intro"
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: ai.initialCanvas }}
        />
      )}
      <section
        className={`chat-session ${ai.isGenerating ? "is-generating" : ""}`}
        aria-live="polite"
        dangerouslySetInnerHTML={{ __html: ai.hasChatted ? ai.canvas : "" }}
      />
    </main>
  );
}

export default ChatSessionPage;
