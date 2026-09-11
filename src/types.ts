import type { FormEvent } from "react";

export type Availability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

export type PortfolioTab = {
  id: string;
  label: string;
  prompt: string;
};

export type ModelMonitor = {
  addEventListener: (
    type: "downloadprogress",
    listener: (event: { loaded: number }) => void,
  ) => void;
};

export type PromptSession = {
  prompt: (
    input: string | Array<{ role: string; content: string }>,
    options?: { signal?: AbortSignal; responseConstraint?: object },
  ) => Promise<string>;
  promptStreaming: (
    input: string,
    options?: { signal?: AbortSignal },
  ) => ReadableStream<string>;
  destroy: () => void;
};

export type LanguageModelApi = {
  availability: (options: object) => Promise<Availability>;
  create: (options?: {
    initialPrompts?: Array<{ role: string; content: string }>;
    monitor?: (monitor: ModelMonitor) => void;
  }) => Promise<PromptSession>;
};

export type SiteHeaderProps = {
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

export type CanvasAreaProps = {
  isReady: boolean;
  isGenerating: boolean;
  availability: Availability | "checking";
  progress: number;
  canvas: string;
  error: string;
  onActivate: () => void;
  onDismissError: () => void;
};

export type ErrorFallbackProps = {
  availability: Availability | "checking";
  progress: number;
  error: string;
  onActivate: () => void;
};

declare global {
  interface Window {
    LanguageModel?: LanguageModelApi;
  }
}
