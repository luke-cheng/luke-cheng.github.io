import type { ErrorFallbackProps } from "./types";

const STATUS_MESSAGES = {
  checking: {
    heading: "Waking up your on-device AI.",
    description: "Your browser is getting your on-device AI ready. This should only take a moment.",
  },
  unavailable: {
    heading: "This website works best in a browser with built-in AI.",
    description: "Revisit in Google Chrome 138 or newer, or check out my links below.",
  },
  downloadable: {
    heading: "Getting your on-device AI ready to download.",
    description: "Your browser is preparing your on-device AI. The downloading will start automatically.",
  },
  downloading: {
    heading: "Waiting for your browser to finish downloading its AI.",
    description: "Your browser is downloading its on-device AI, and this page will refresh when it is ready.",
  },
  error: {
    heading: "On-Device AI Setup Failed",
    description: "Chrome couldn't prepare the on-device model.",
  },
} as const;

function ErrorFallback({ phase, onReset }: ErrorFallbackProps) {
  const { heading, description } = STATUS_MESSAGES[phase.status as keyof typeof STATUS_MESSAGES]
    ?? STATUS_MESSAGES.unavailable;

  const error = phase.status === "error" ? phase.error : null;
  const progress = (phase.status === "downloadable" || phase.status === "downloading")
    ? phase.progress
    : null;

  return (
    <section className="ai-gate" aria-live="polite">
      <span className="eyebrow">Notice</span>
      <h2>{heading}</h2>
      <p>{description}</p>

      {progress !== null && (
        <div className="progress-track">
          <span style={{ width: `${Math.max(progress * 100, 4)}%` }} />
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">
            <strong>{error.name}:</strong> {error.message}
          </p>
          <div className="error-actions">
            <button className="ui-button" type="button" onClick={onReset}>
              Reload and try again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ErrorFallback;
