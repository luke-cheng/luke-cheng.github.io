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
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);
  const isDownloading = ai.promptApiPhase.status === "downloading";
  const showErrorNotice = Boolean(ai.generationError);
  const showUnavailableNotice =
    !ai.isReady &&
    !isDownloading &&
    !showErrorNotice &&
    !isNoticeDismissed;
  const showNotice = showErrorNotice || showUnavailableNotice;
  const downloadProgress =
    ai.promptApiPhase.status === "downloading"
      ? Math.min(
          100,
          Math.max(
            0,
            ai.promptApiPhase.progress <= 1
              ? ai.promptApiPhase.progress * 100
              : ai.promptApiPhase.progress,
          ),
        )
      : 0;

  const handleNoticeDismiss = () => {
    if (showErrorNotice) {
      ai.onDismissError();
    }
    setIsNoticeDismissed(true);
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
                : ai.promptApiPhase.status === "unavailable"
                  ? "On-device AI isn't available"
                  : "On-device AI isn't ready yet"}
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
                : ai.promptApiPhase.status === "unavailable"
                  ? "This browser doesn't support on-device AI, so chat isn't available here."
                  : "The browser is checking whether on-device AI can be started."}
            </p>
            <details>
              <summary>Technical details</summary>
              <p className="inline-error__raw">
                {ai.generationError ? (
                  <>
                    <strong>{ai.generationError.name || "Error"}:</strong>{" "}
                    {ai.generationError.message || "No additional details were provided."}
                  </>
                ) : (
                  <>
                    Prompt API status: {ai.promptApiPhase.status}.
                    {ai.promptApiPhase.status === "unavailable" &&
                      " The browser does not expose a compatible Prompt API."}
                  </>
                )}
              </p>
            </details>
          </div>
        </div>
      )}
      {!showNotice && isDownloading && (
        <div className="download-status" role="status" aria-live="polite">
          <strong>Preparing local AI</strong>
          <p>Downloading the on-device model ({Math.round(downloadProgress)}%).</p>
          <progress
            className="download-status__progress"
            max={100}
            value={downloadProgress}
            aria-label={`Downloading local AI: ${Math.round(downloadProgress)}%`}
          />
        </div>
      )}
      {!showNotice && !isDownloading && (
        <section
          className="floating-chat-bar"
          aria-label="AI chat composer"
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
      )}
    </div>
  );
}
