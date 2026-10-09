import Link from "next/link";
import { PaperPlaneTiltIcon, StopIcon, SparkleIcon } from "@phosphor-icons/react";

export type SitePage = "home" | "work" | "interests" | "thoughts";

export type PortfolioAssistantProps = {
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

export type SiteHeaderProps = {
  page: SitePage;
  assistant: PortfolioAssistantProps;
};

function PortfolioControls(props: PortfolioAssistantProps) {
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
    <div className="header-bottom">
      <form className="question-bar" onSubmit={onQuestion}>
        <span className="prompt-symbol" aria-hidden="true">
          <SparkleIcon fontSize="inherit" />
        </span>
        <input
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder={
            isReady
              ? "Ask me anything about Luke..."
              : "Preparing local AI..."
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
      {suggestions.length > 0 && (
        <div className="question-suggestions" aria-label="Suggested questions">
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
  );
}

function StaticNavigation({ page }: { page: SiteHeaderProps["page"] }) {
  return (
    <>
      <Link
        className={`ui-button ui-button--tab ${page === "work" ? "active" : ""}`}
        href="/work/"
        aria-current={page === "work" ? "page" : undefined}
      >
        <span>01</span>
        Work
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "interests" ? "active" : ""}`}
        href="/interests/"
        aria-current={page === "interests" ? "page" : undefined}
      >
        <span>02</span>
        Interests
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "thoughts" ? "active" : ""}`}
        href="/thoughts/"
        aria-current={page === "thoughts" ? "page" : undefined}
      >
        <span>03</span>
        Thoughts
      </Link>
    </>
  );
}

function SiteHeader(props: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="ui-button ui-button--identity" href="/">
          <strong>Luke Cheng</strong>
        </Link>
        <nav className="tab-nav" aria-label="Site navigation">
          <StaticNavigation page={props.page} />
        </nav>
      </div>
      <PortfolioControls {...props.assistant} />
    </header>
  );
}

export default SiteHeader;
