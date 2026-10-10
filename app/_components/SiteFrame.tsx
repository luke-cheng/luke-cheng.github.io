"use client";

import type { ReactNode } from "react";
import { usePortfolioAi } from "@/app/_hooks/usePortfolioAi";
import SiteFooter from "@/app/_components/SiteFooter";
import SiteHeader from "@/app/_components/SiteHeader";
import FloatingChatBar from "@/app/_components/FloatingChatBar";
import { PortfolioAiContext } from "@/app/_components/PortfolioAiContext";

function SiteFrame({ children }: { children: ReactNode }) {
  const ai = usePortfolioAi();

  return (
    <PortfolioAiContext.Provider value={ai}>
      <div className={`site-shell ${ai.isGenerating ? "is-generating" : ""}`}>
        <SiteHeader />
        {children}
        <FloatingChatBar />
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
