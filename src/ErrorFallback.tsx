import type { ErrorFallbackProps } from "./types";

function ErrorFallback({
  availability,
  progress,
  error,
  onActivate,
}: ErrorFallbackProps) {
  return (
    <section className="ai-gate" aria-live="polite">
      <span className="eyebrow">Notice</span>
      <h2>
        {availability === "unavailable"
          ? "This website is best viewed in a browser with built-in AI."
          : availability === "downloading"
            ? "The AI model is downloading."
            : "A browser-native portfolio, still warming up."}
      </h2>
      <p>
        {availability === "unavailable"
          ? "Open this site in a supported desktop version of Chrome with Prompt API access, or check out the links in the footer."
          : "Your first visit downloads the model to your device. Nothing is sent to a remote AI service."}
      </p>
      {availability === "downloading" && (
        <div className="progress-track">
          <span style={{ width: `${Math.max(progress * 100, 4)}%` }} />
        </div>
      )}
      {availability !== "unavailable" && availability !== "downloading" && (
        <button className="primary-button" type="button" onClick={onActivate}>
          Enable local AI <span>↗</span>
        </button>
      )}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default ErrorFallback;
