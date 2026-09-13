import ErrorFallback from "./ErrorFallback";
import type { CanvasAreaProps } from "./types";

function CanvasArea({ phase, canvas, isGenerating, generationError, onDismissError, onReset }: CanvasAreaProps) {
  if (phase.status !== "ready") {
    return (
      <main className="canvas-wrap">
        <ErrorFallback phase={phase} onDismissError={onDismissError} onReset={onReset} />
      </main>
    );
  }

  return (
    <main className="canvas-wrap">
      <section
        className={`generated-canvas ${isGenerating ? "is-generating" : ""}`}
        aria-live="polite"
        dangerouslySetInnerHTML={{ __html: canvas }}
      />
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
