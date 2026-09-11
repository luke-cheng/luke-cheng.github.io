import type { FormEvent } from "react";
import type { PortfolioTab } from "./types";

type SiteHeaderProps = {
  tabs: PortfolioTab[];
  activeTab: string;
  question: string;
  statusLabel: string;
  isReady: boolean;
  isGenerating: boolean;
  onTabChange: (tab: PortfolioTab) => void;
  onQuestionChange: (question: string) => void;
  onQuestion: (event: FormEvent<HTMLFormElement>) => void;
  onStop: () => void;
  onReset: () => void;
};

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
            placeholder="Ask the portfolio a question..."
            aria-label="Ask the portfolio a question"
            disabled={isGenerating}
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
              <span aria-hidden="true">×</span>
            </button>
          ) : (
            <button
              className="submit-button"
              type="submit"
              aria-label="Ask question"
              disabled={!question.trim()}
            >
              <span className="return-icon" aria-hidden="true" />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}

export default SiteHeader;
