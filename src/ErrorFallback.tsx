import type { Availability } from "./types";

type ErrorFallbackProps = {
  availability: Availability | "checking";
  progress: number;
  error: string;
  onActivate: () => void;
};

function ErrorFallback({ availability, progress, error, onActivate }: ErrorFallbackProps) {
  return (
    <section className="ai-gate" aria-live="polite">
      <span className="eyebrow">Local inference layer</span>
      <h2>
        {availability === "unavailable"
          ? "This portfolio needs Chrome’s built-in AI."
          : availability === "downloading"
            ? "The model is arriving locally."
            : "A browser-native portfolio, still warming up."}
      </h2>
      <p>
        {availability === "unavailable"
          ? "Open this site in a supported desktop version of Chrome with Prompt API access. The editorial preview remains available below."
          : "The first visit downloads the model to your device. Nothing in this portfolio is sent to a remote AI service."}
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
