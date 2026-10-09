"use client";

import { usePortfolioAiState } from "@/app/_components/PortfolioAiContext";

export default function ChatPage() {
  const ai = usePortfolioAiState();

  return (
    <main className="canvas-wrap">
      <div className="generated-canvas-wrap">
        <section
          className={`generated-canvas ${ai.isGenerating ? "is-generating" : ""}`}
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: ai.canvas }}
        />
      </div>
    </main>
  );
}
