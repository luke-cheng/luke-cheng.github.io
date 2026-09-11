import type { SiteHeaderProps } from "./types";

import AssistantIcon from "@mui/icons-material/Assistant";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
function SiteHeader({
  tabs,
  activeTab,
  question,
  statusLabel,
  isReady,
  isGenerating,
  onTabChange,
  onQuestionChange,
  onQuestion,
  onStop,
  onReset,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-top">
        <button className="identity" type="button" onClick={onReset}>
          <strong>Luke Cheng</strong>
        </button>
        <nav className="tab-nav" aria-label="Portfolio views">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
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
          <span className="prompt-symbol">↳</span>
          <input
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            placeholder={
              isReady
                ? "Ask the portfolio a question..."
                : "Local AI is not ready"
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
              className="exit-button"
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
              className="submit-button"
              type="submit"
              aria-label="Ask question"
              disabled={!isReady || !question.trim()}
            >
              <AssistantIcon />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}

export default SiteHeader;
