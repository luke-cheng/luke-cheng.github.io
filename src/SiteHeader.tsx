import type { SiteHeaderProps } from "./types";

import AssistantIcon from "@mui/icons-material/Assistant";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import SendIcon from "@mui/icons-material/Send";
function SiteHeader({
  tabs,
  activeTab,
  question,
  suggestions,
  statusLabel,
  isReady,
  isGenerating,
  onTabChange,
  onQuestionChange,
  onQuestion,
  onSuggestionSelect,
  onStop,
  onReset,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-top">
        <button
          className="ui-button ui-button--identity"
          type="button"
          onClick={onReset}
        >
          <strong>Luke Cheng</strong>
        </button>
        <nav className="tab-nav" aria-label="Portfolio views">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`ui-button ui-button--tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              type="button"
              onClick={() => onTabChange(tab)}
              disabled={!isReady || isGenerating}
            >
              <span>0{index + 1}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="header-bottom">
        <form className="question-bar" onSubmit={onQuestion}>
          <span className="prompt-symbol">
            <AssistantIcon />
          </span>
          <input
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            placeholder={
              isReady
                ? "Ask me anything..."
                : "Preparing on-device AI..."
            }
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
              <span aria-hidden="true">
                <CancelScheduleSendIcon />
              </span>
            </button>
          ) : (
            <button
              className="ui-button ui-button--icon ui-button--submit"
              type="submit"
              aria-label="Ask question"
              disabled={!isReady || !question.trim()}
            >
              <SendIcon />
            </button>
          )}
        </form>
        {suggestions.length > 0 && (
          <div
            className="question-suggestions"
            aria-label="Suggested questions"
          >
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
      </div>
    </header>
  );
}

export default SiteHeader;
