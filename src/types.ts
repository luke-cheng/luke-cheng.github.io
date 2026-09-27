export type PortfolioTab = {
  id: string;
  label: string;
  prompt: string;
};

/** Raw error from the API — name and message surfaced directly, no interpretation. */
export type AiError = {
  name: string;
  message: string;
};

/** A complete description of the on-device AI setup phase. */
export type AiPhase =
  | { status: "checking" }
  | { status: "unavailable" }
  | { status: "downloadable"; progress: number }
  | { status: "downloading"; progress: number }
  | { status: "ready" }
  | { status: "error"; error: AiError };

export type AiUnavailablePhase = Exclude<AiPhase, { status: "ready" }>;

export type SiteHeaderProps = {
  tabs: PortfolioTab[];
  activeTab: string;
  question: string;
  suggestions: string[];
  statusLabel: string;
  isReady: boolean;
  isGenerating: boolean;
  onTabChange: (tab: PortfolioTab) => void;
  onQuestionChange: (question: string) => void;
  onQuestion: (event: React.SyntheticEvent<HTMLFormElement>) => void;
  onSuggestionSelect: (question: string) => void;
  onStop: () => void;
  onReset: () => void;
};

export type CanvasAreaProps = {
  canvas: string;
  isGenerating: boolean;
};

export type ErrorFallbackProps = {
  phase: AiUnavailablePhase;
  onReset: () => void;
};
