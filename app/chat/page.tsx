"use client";

import { usePortfolioAiState } from "@/app/_components/PortfolioAiContext";

export default function ChatPage() {
  const ai = usePortfolioAiState();
  const hasConversation = ai.messages.length > 0;
  return <main className="chat-page" aria-label="Portfolio assistant conversation" aria-live="polite">
      {!hasConversation && <div className="chat-welcome">
        <h2>How can I help?</h2>
        <p>Ask about Luke&apos;s work, interests, or the ideas behind this portfolio.</p>
      </div>}
      {ai.messages.map((message) => message.role === "user" ? (
        <article className="chat-message chat-message--user" key={message.id}>
          <div className="chat-message__bubble">
            <p className="chat-message__question">{message.content}</p>
          </div>
        </article>
      ) : (
        <article className="chat-message chat-message--assistant" key={message.id}>
          <div className="chat-message__bubble">
            {message.content ? <div className="chat-message__content" dangerouslySetInnerHTML={{ __html: message.content }} /> : <span className="chat-typing">Thinking...</span>}
          </div>
        </article>
      ))}
  </main>;
}
