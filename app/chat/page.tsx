"use client";

import { usePortfolioAiState } from "@/app/_components/PortfolioAiContext";

export default function ChatPage() {
  const ai = usePortfolioAiState();
  const hasConversation = ai.messages.length > 0;
  return <main className={`chat-page ${hasConversation ? "has-conversation" : ""}`}>
    <section className="chat-session" aria-live="polite">
      {/*<article className="chat-welcome"><h1>SDE at JPMorgan Chase.<br />Former Chemist.<br />Driven by curiosity about how our worlds work.</h1><p>Ask about Luke’s work, interests, or the thinking behind the portfolio.</p></article>*/}
      {ai.messages.map((message) => message.role === "user" ? <article className="chat-message chat-message--user" key={message.id}>{message.content}</article> : <article className="chat-message chat-message--assistant" key={message.id}>{message.content ? <div dangerouslySetInnerHTML={{ __html: message.content }} /> : <span className="chat-typing">Thinking…</span>}</article>)}
    </section>
  </main>;
}
