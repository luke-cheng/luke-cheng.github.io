"use client";

import { PaperPlaneTiltIcon, SparkleIcon, StopIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePortfolioAiState } from "@/app/_components/PortfolioAiContext";
import type { ChatPageContext } from "@/app/_hooks/usePortfolioAi";

function getPageContext(pathname: string): ChatPageContext {
  if (pathname.startsWith("/work")) return { path: pathname, title: "Work", summary: "Luke's professional experience, roles, and technical contributions." };
  if (pathname.startsWith("/about")) return { path: pathname, title: "About", summary: "Luke's background, career path, and personal interests." };
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
  const [isUnavailableDismissed, setIsUnavailableDismissed] = useState(false);
  const showUnavailableNotice = ai.isPromptApiUnavailable && !isUnavailableDismissed;
  const showErrorNotice = Boolean(ai.generationError);
  const showNotice = showErrorNotice || showUnavailableNotice;

  const handleNoticeDismiss = () => {
    if (showErrorNotice) {
      ai.onDismissError();
    } else {
      setIsUnavailableDismissed(true);
    }
  };

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

  return (
    <div className="chat-dock">
      {showNotice && (
        <div className="inline-error" role="alert">
          <div className="inline-error__header">
            <strong className="inline-error__title">
              {showErrorNotice
                ? "The on-device AI hit a snag"
                : "On-device AI isn't available"}
            </strong>
            <button
              className="ui-button ui-button--inline"
              type="button"
              onClick={handleNoticeDismiss}
            >
              Dismiss
            </button>
          </div>
          <div className="inline-error__content">
            <p className="inline-error__message">
              {showErrorNotice
                ? "The browser couldn't start or complete the request. Expand the details to inspect the error."
                : "This browser doesn't support on-device AI, so chat isn't available here."}
            </p>
            {ai.generationError && (
              <details>
                <summary>Technical details</summary>
                <p className="inline-error__raw">
                  <strong>{ai.generationError.name || "Error"}:</strong>{" "}
                  {ai.generationError.message || "No additional details were provided."}
                </p>
              </details>
            )}
          </div>
        </div>
      )}
      <section
        className="floating-chat-bar"
        aria-label="AI chat composer"
        inert={showNotice}
      >
        {ai.suggestions.length > 0 && (
          <div className="question-suggestions" aria-label="Suggested questions">
            {ai.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="ui-button ui-button--pill"
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                disabled={!ai.isReady || ai.isGenerating}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <form className="question-bar" onSubmit={handleSubmit}>
          <span className="prompt-symbol" aria-hidden="true">
            <SparkleIcon fontSize="inherit" />
          </span>
          <input
            value={ai.question}
            onChange={(event) => ai.onQuestionChange(event.target.value)}
            placeholder={
              ai.isReady
                ? "Ask me anything about Luke..."
                : ai.statusLabel === "Local AI unavailable"
                  ? "Local AI is unavailable in this browser"
                  : "Preparing local AI..."
            }
            aria-label="Ask the portfolio a question"
            disabled={!ai.isReady || ai.isGenerating}
          />
          <span className="model-status">
            <span className={`status-dot ${ai.isReady ? "ready" : ""}`} />
            {ai.statusLabel}
          </span>
          {ai.isGenerating ? (
            <button
              className="ui-button ui-button--icon ui-button--stop"
              type="button"
              aria-label="Stop generating"
              onClick={ai.onStop}
            >
              <StopIcon fontSize="inherit" />
            </button>
          ) : (
            <button
              className="ui-button ui-button--icon ui-button--submit"
              type="submit"
              aria-label="Ask question"
              disabled={!ai.isReady || !ai.question.trim()}
            >
              <PaperPlaneTiltIcon fontSize="inherit" />
            </button>
          )}
        </form>
      </section>
    </div>
  );
}
