/** Raw error from the API, surfaced directly to the visitor. */
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
