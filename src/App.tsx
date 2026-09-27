import "./App.css";
import CanvasArea from "./CanvasArea";
import ErrorFallback from "./ErrorFallback";
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
      {ai.phase.status === "ready" ? (
        <>
          <CanvasArea canvas={ai.canvas} isGenerating={ai.isGenerating} />
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
        </>
      ) : (
        <main className="canvas-wrap">
          <ErrorFallback phase={ai.phase} onReset={ai.onReset} />
        </main>
      )}
      <SiteFooter />
    </div>
  );
}

export default App;
