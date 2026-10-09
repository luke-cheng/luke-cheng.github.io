"use client";

import { PaperPlaneTiltIcon, SparkleIcon, StopIcon } from "@phosphor-icons/react";

export type FloatingChatBarProps = {
  question: string;
  suggestions: string[];
  statusLabel: string;
  isReady: boolean;
  isGenerating: boolean;
  onQuestionChange: (question: string) => void;
  onQuestion: (event: React.SyntheticEvent<HTMLFormElement>) => void;
  onSuggestionSelect: (question: string) => void;
  onStop: () => void;
};

function FloatingChatBar(props: FloatingChatBarProps) {
  const {
    question,
    suggestions,
    statusLabel,
    isReady,
    isGenerating,
    onQuestionChange,
    onQuestion,
    onSuggestionSelect,
    onStop,
  } = props;

  return (
    <section className="floating-chat" aria-label="AI chat input">
      {suggestions.length > 0 && (
        <div className="floating-chat-suggestions" aria-label="Suggested questions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="ui-button ui-button--pill"
              type="button"
              onClick={() => onSuggestionSelect(suggestion)}
              disabled={!isReady || isGenerating}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <form className="floating-question-bar" onSubmit={onQuestion}>
        <span className="prompt-symbol" aria-hidden="true">
          <SparkleIcon fontSize="inherit" />
        </span>
        <input
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder={isReady ? "Ask me anything about Luke..." : "Preparing local AI..."}
          aria-label="Ask the portfolio a question"
          disabled={!isReady || isGenerating}
        />
        <span className="model-status">
          <span className={`status-dot ${isReady ? "ready" : ""}`} />
          {statusLabel}
        </span>
        {isGenerating ? (
          <button
            className="ui-button ui-button--icon ui-button--stop"
            type="button"
            aria-label="Stop generating"
            title="Stop generating"
            onClick={onStop}
          >
            <StopIcon fontSize="inherit" aria-hidden="true" />
          </button>
        ) : (
          <button
            className="ui-button ui-button--icon ui-button--submit"
            type="submit"
            aria-label="Ask question"
            disabled={!isReady || !question.trim()}
          >
            <PaperPlaneTiltIcon fontSize="inherit" aria-hidden="true" />
          </button>
        )}
      </form>
    </section>
  );
}

export default FloatingChatBar;
