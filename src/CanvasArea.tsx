import ErrorFallback from "./ErrorFallback";
import type { CanvasAreaProps } from "./types";

function CanvasArea({ phase, canvas, isGenerating, generationError, onDismissError, onReset }: CanvasAreaProps) {
  if (phase.blocks) {
    return (
      <main className="canvas-wrap">
        <ErrorFallback phase={phase} onDismissError={onDismissError} onReset={onReset} />
      </main>
    );
  }

  const showNotice = phase.status !== "ready";

  return (
    <main className="canvas-wrap">
      {showNotice && (
        <ErrorFallback phase={phase} compact onDismissError={onDismissError} onReset={onReset} />
      )}
      <div className="generated-canvas-wrap">
        <section
          className={`generated-canvas ${isGenerating ? "is-generating" : ""} ${showNotice ? "canvas-pending" : ""}`}
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: canvas }}
        />
      </div>
      {generationError && (
        <div className="inline-error" role="alert">
          <strong>{generationError.name}:</strong> {generationError.message}
          <button
            className="ui-button ui-button--inline"
            type="button"
            onClick={onDismissError}
          >
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}

export default CanvasArea;
