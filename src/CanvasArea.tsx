import ErrorFallback from "./ErrorFallback";
import type { CanvasAreaProps } from "./types";

function CanvasArea({
  isReady,
  isGenerating,
  availability,
  progress,
  canvas,
  error,
  onDismissError,
}: CanvasAreaProps) {
  return (
    <main className="canvas-wrap">
      {!isReady && (
        <ErrorFallback
          availability={availability}
          progress={progress}
          error={error}
        />
      )}
      {isReady && (
        <section
          className={`generated-canvas ${isGenerating ? "is-generating" : ""}`}
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: canvas }}
        />
      )}
      {error && isReady && (
        <div className="inline-error">
          {error}{" "}
          <button type="button" onClick={onDismissError}>
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}

export default CanvasArea;
