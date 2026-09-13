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

/**
 * Single discriminated union replacing availability + isReady + progress + boot error.
 * Each status is a complete description of the AI's current phase.
 *
 * `blocks: true` — canvas cannot be shown, show full-page gate instead.
 * `blocks: false` — canvas is visible; phase may still show a notice banner.
 */
export type AiPhase =
  | { status: "checking";     blocks: false }
  | { status: "unavailable";  blocks: true }
  | { status: "downloadable"; blocks: false; progress: number }
  | { status: "downloading";  blocks: false; progress: number }
  | { status: "ready";        blocks: false }
  | { status: "error";        blocks: true; error: AiError };

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
  phase: AiPhase;
  canvas: string;
  isGenerating: boolean;
  generationError: AiError | null;
  onDismissError: () => void;
  onReset: () => void;
};

export type ErrorFallbackProps = {
  phase: AiPhase;
  compact?: boolean;
  onDismissError: () => void;
  onReset: () => void;
};
