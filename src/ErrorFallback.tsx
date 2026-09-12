import type { ErrorFallbackProps } from "./types";

function ErrorFallback({
  availability,
  progress,
  error,
}: ErrorFallbackProps) {
  const isDownloading =
    availability === "downloadable" || availability === "downloading";
  const messages = {
    unavailable: {
      heading: "This website works best in a browser with built-in AI.",
      description:
        "Revisit in Google Chrome 138 or newer, or check out my links below.",
    },
    downloadable: {
      heading: "Getting your on-device AI ready to download.",
      description:
        "Your browser is preparing your on-device AI. The downloading will start automatically.",
    },
    downloading: {
      heading: "Waiting for your browser to finish downloading its AI.",
      description:
        "Your browser is downloading its on-device AI, and this page will refresh when it is ready.",
    },
    available: {
      heading: "Waking up your on-device AI.",
      description:
        "Your browser is getting the on-device AI ready. This should only take a moment.",
    },
    checking: {
      heading: "Waking up your on-device AI.",
      description:
        "Your browser is getting the on-device AI ready. This should only take a moment.",
    },
  } as const;
  const { heading, description } = messages[availability];

  return (
    <section className="ai-gate" aria-live="polite">
      <span className="eyebrow">Notice</span>
      <h2>{heading}</h2>
      <p>{description}</p>
      {isDownloading && (
        <div className="progress-track">
          <span style={{ width: `${Math.max(progress * 100, 4)}%` }} />
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default ErrorFallback;
