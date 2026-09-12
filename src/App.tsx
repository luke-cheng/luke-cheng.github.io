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
        statusLabel={ai.statusLabel}
        isReady={ai.isReady}
        isGenerating={ai.isGenerating}
        onTabChange={ai.onTabChange}
        onQuestionChange={ai.onQuestionChange}
        onQuestion={ai.onQuestion}
        onStop={ai.onStop}
        onReset={ai.onReset}
      />
      <CanvasArea
        isReady={ai.isReady}
        isGenerating={ai.isGenerating}
        availability={ai.availability}
        progress={ai.progress}
        canvas={ai.canvas}
        error={ai.error}
        onDismissError={ai.onDismissError}
      />
      <SiteFooter />
    </div>
  );
}

export default App;
