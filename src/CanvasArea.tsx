import ErrorFallback from "./ErrorFallback";
import type { Availability } from "./types";

type CanvasAreaProps = {
  isReady: boolean;
  isGenerating: boolean;
  availability: Availability | "checking";
  progress: number;
  canvas: string;
  error: string;
  onActivate: () => void;
  onDismissError: () => void;
};

function CanvasArea({
  isReady,
  isGenerating,
  availability,
  progress,
  canvas,
  error,
  onActivate,
  onDismissError,
}: CanvasAreaProps) {
  return (
    <main className="canvas-wrap">
      {!isReady && (
        <ErrorFallback
          availability={availability}
          progress={progress}
          error={error}
          onActivate={onActivate}
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
