"use client";

import { usePortfolioAiState } from "./_components/PortfolioAiContext";

export default function HomePage() {
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
