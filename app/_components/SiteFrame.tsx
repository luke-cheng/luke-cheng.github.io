"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePortfolioAi } from "../_hooks/usePortfolioAi";
import SiteFooter from "./SiteFooter";
import SiteHeader, { type SitePage } from "./SiteHeader";
import { PortfolioAiContext } from "./PortfolioAiContext";

function getCurrentPage(pathname: string): SitePage {
  if (pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/interests")) return "interests";
  if (pathname.startsWith("/thoughts")) return "thoughts";
  return "home";
}

function SiteFrame({ children }: { children: ReactNode }) {
  const ai = usePortfolioAi();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const page = getCurrentPage(pathname);

  const onQuestion = (event: React.SyntheticEvent<HTMLFormElement>) => {
    const shouldOpenCanvas = ai.isReady && Boolean(ai.question.trim());
    ai.onQuestion(event);
    if (shouldOpenCanvas && pathname !== "/") router.push("/");
  };

  const onSuggestionSelect = (question: string) => {
    if (!ai.isReady || ai.isGenerating) return;
    ai.onSuggestionSelect(question);
    if (pathname !== "/") router.push("/");
  };

  return (
    <PortfolioAiContext.Provider value={ai}>
      <div className={`site-shell ${ai.isGenerating ? "is-generating" : ""}`}>
        <SiteHeader
          page={page}
          assistant={{
            question: ai.question,
            suggestions: ai.suggestions,
            statusLabel: ai.statusLabel,
            isReady: ai.isReady,
            isGenerating: ai.isGenerating,
            onQuestionChange: ai.onQuestionChange,
            onQuestion,
            onSuggestionSelect,
            onStop: ai.onStop,
          }}
        />
        {children}
        {ai.generationError && (
          <div className="inline-error" role="alert">
            <strong>{ai.generationError.name}:</strong> {ai.generationError.message}
            <button
              className="ui-button ui-button--inline"
              type="button"
              onClick={ai.onDismissError}
            >
              Dismiss
            </button>
          </div>
        )}
        <SiteFooter />
      </div>
    </PortfolioAiContext.Provider>
  );
}

export default SiteFrame;
