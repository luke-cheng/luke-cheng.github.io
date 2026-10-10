"use client";

import { PaperPlaneTiltIcon, SparkleIcon, StopIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { usePortfolioAiState } from "@/app/_components/PortfolioAiContext";
import type { ChatPageContext } from "@/app/_hooks/usePortfolioAi";

function getPageContext(pathname: string): ChatPageContext {
  if (pathname.startsWith("/work")) return { path: pathname, title: "Work", summary: "Luke's professional experience, roles, and technical contributions." };
  if (pathname.startsWith("/interests")) return { path: pathname, title: "Interests", summary: "Luke's leadership activities, hobbies, and personal interests." };
  if (pathname.startsWith("/thoughts/")) return { path: pathname, title: "Thoughts article", summary: "One of Luke's written thoughts or draft articles." };
  if (pathname.startsWith("/thoughts")) return { path: pathname, title: "Thoughts", summary: "Luke's collection of written thoughts and draft articles." };
  if (pathname.startsWith("/chat")) return { path: pathname, title: "AI Chat", summary: "The ongoing portfolio conversation." };
  return { path: pathname, title: "Home", summary: "Luke's portfolio overview and AI-generated introduction." };
}

export default function FloatingChatBar() {
  const ai = usePortfolioAiState();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const pageContext = getPageContext(pathname);

  const openChat = () => {
    if (!pathname.startsWith("/chat")) router.push("/chat/");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ai.question.trim() || !ai.isReady) return;
    ai.onQuestion(pageContext);
    openChat();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (!ai.isReady || ai.isGenerating) return;
    ai.onSuggestionSelect(suggestion, pageContext);
    openChat();
  };

  return <section className="floating-chat-bar" aria-label="AI chat composer">
    {ai.suggestions.length > 0 && <div className="question-suggestions" aria-label="Suggested questions">
      {ai.suggestions.map((suggestion) => <button key={suggestion} className="ui-button ui-button--pill" type="button" onClick={() => handleSuggestionSelect(suggestion)} disabled={!ai.isReady || ai.isGenerating}>{suggestion}</button>)}
    </div>}
    <form className="question-bar" onSubmit={handleSubmit}>
      <span className="prompt-symbol" aria-hidden="true"><SparkleIcon fontSize="inherit" /></span>
      <input value={ai.question} onChange={(event) => ai.onQuestionChange(event.target.value)} placeholder={ai.isReady ? "Ask me anything about Luke..." : "Preparing local AI..."} aria-label="Ask the portfolio a question" disabled={!ai.isReady || ai.isGenerating} />
      <span className="model-status"><span className={`status-dot ${ai.isReady ? "ready" : ""}`} />{ai.statusLabel}</span>
      {ai.isGenerating ? <button className="ui-button ui-button--icon ui-button--stop" type="button" aria-label="Stop generating" onClick={ai.onStop}><StopIcon fontSize="inherit" /></button> : <button className="ui-button ui-button--icon ui-button--submit" type="submit" aria-label="Ask question" disabled={!ai.isReady || !ai.question.trim()}><PaperPlaneTiltIcon fontSize="inherit" /></button>}
    </form>
  </section>;
}
