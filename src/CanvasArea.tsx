import type { CanvasAreaProps } from "./types";

function CanvasArea({ canvas, isGenerating }: CanvasAreaProps) {
  return (
    <main className="canvas-wrap">
      <div className="generated-canvas-wrap">
        <section
          className={`generated-canvas ${isGenerating ? "is-generating" : ""}`}
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: canvas }}
        />
      </div>
    </main>
  );
}

export default CanvasArea;
