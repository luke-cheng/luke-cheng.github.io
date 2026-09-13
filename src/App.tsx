import "./App.css";
import CanvasArea from "./CanvasArea";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { usePortfolioAi } from "./usePortfolioAi";

function App() {
  const ai = usePortfolioAi();

  return (
    <div className={`site-shell ${ai.isGenerating ? "is-generating" : ""}`}>
      <SiteHeader
        tabs={ai.tabs}
        activeTab={ai.activeTab}
        question={ai.question}
        suggestions={ai.suggestions}
        statusLabel={ai.statusLabel}
        isReady={ai.isReady}
        isGenerating={ai.isGenerating}
        onTabChange={ai.onTabChange}
        onQuestionChange={ai.onQuestionChange}
        onQuestion={ai.onQuestion}
        onSuggestionSelect={ai.onSuggestionSelect}
        onStop={ai.onStop}
        onReset={ai.onReset}
      />
      <CanvasArea
        phase={ai.phase}
        canvas={ai.canvas}
        isGenerating={ai.isGenerating}
        generationError={ai.generationError}
        onDismissError={ai.onDismissError}
        onReset={ai.onReset}
      />
      <SiteFooter />
    </div>
  );
}

export default App;
