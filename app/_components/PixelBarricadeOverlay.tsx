"use client";

type PixelBarricadeOverlayProps = {
  blockClicks?: boolean;
  details?: string;
  message?: string;
  progress?: number;
  tag?: string;
  tintOpacity?: number;
};

export function PixelBarricadeOverlay({
  blockClicks = true,
  details = "Our cute animal crew is busy building new features. Stay tuned for launch!",
  message = "COMING SOON! CATS AT WORK",
  progress,
  tag = "WIP • NEW FEATURE",
  tintOpacity = 0,
}: PixelBarricadeOverlayProps) {
  return (
    <div
      className="pixel-barricade-overlay"
      style={{
        backgroundColor: `rgba(15, 23, 42, ${tintOpacity})`,
        pointerEvents: blockClicks ? "auto" : "none",
      }}
    >
      <p className="pixel-barricade-overlay__announcement" role="status">
        {message}
      </p>
      <div className="pixel-barricade-overlay__rails" aria-hidden="true">
        <div className="pixel-barricade-overlay__rail" />
        <div className="pixel-barricade-overlay__rail-spacer" />
        <div className="pixel-barricade-overlay__rail" />
      </div>
      <svg
        className="pixel-barricade-overlay__cone"
        viewBox="0 0 16 24"
        aria-hidden="true"
      >
        <rect x="7" y="1" width="2" height="2" fill="#fff" />
        <rect x="6" y="3" width="4" height="3" fill="#f97316" />
        <rect x="5" y="6" width="6" height="3" fill="#fff" />
        <rect x="4" y="9" width="8" height="3" fill="#f97316" />
        <rect x="3" y="12" width="10" height="3" fill="#fff" />
        <rect x="2" y="15" width="12" height="3" fill="#f97316" />
        <rect x="1" y="18" width="14" height="4" fill="#18181b" />
        <rect x="0" y="21" width="16" height="3" fill="#f97316" />
      </svg>
      <div className="pixel-barricade-overlay__sign">
        <svg
          className="pixel-barricade-overlay__character"
          viewBox="0 0 28 28"
          aria-hidden="true"
        >
          <rect x="10" y="3" width="8" height="2" fill="#facc15" />
          <rect x="9" y="5" width="10" height="2" fill="#eab308" />
          <rect x="7" y="7" width="14" height="1" fill="#18181b" />
          <rect x="8" y="8" width="2" height="2" fill="#f97316" />
          <rect x="18" y="8" width="2" height="2" fill="#f97316" />
          <rect x="8" y="10" width="12" height="7" fill="#fb923c" />
          <rect x="10" y="12" width="2" height="2" fill="#18181b" />
          <rect x="16" y="12" width="2" height="2" fill="#18181b" />
          <rect x="13" y="14" width="2" height="1" fill="#f43f5e" />
          <rect x="9" y="17" width="10" height="7" fill="#2563eb" />
          <rect x="9" y="24" width="4" height="2" fill="#fff" />
          <rect x="15" y="24" width="4" height="2" fill="#fff" />
          <rect x="19" y="13" width="4" height="3" fill="#fb923c" />
          <rect x="22" y="12" width="2" height="4" fill="#fff" />
        </svg>
        <div className="pixel-barricade-overlay__board">
          {tag && <div className="pixel-barricade-overlay__tag">{tag}</div>}
          <div className="pixel-barricade-overlay__message">{message}</div>
          <details className="pixel-barricade-overlay__details">
            <summary>
              <strong>📋 DETAILS:</strong>
            </summary>
            <span>{details}</span>
          </details>
          {progress !== undefined && (
            <progress
              className="pixel-barricade-overlay__progress"
              max={100}
              value={progress}
              aria-label={`Downloading local AI: ${Math.round(progress)}%`}
            />
          )}
        </div>
        <svg
          className="pixel-barricade-overlay__character"
          viewBox="0 0 28 28"
          aria-hidden="true"
        >
          <rect x="10" y="2" width="8" height="2" fill="#fff" />
          <rect x="9" y="4" width="10" height="2" fill="#e2e8f0" />
          <rect x="7" y="6" width="14" height="1" fill="#18181b" />
          <rect x="8" y="7" width="2" height="2" fill="#d97706" />
          <rect x="18" y="7" width="2" height="2" fill="#d97706" />
          <rect x="8" y="9" width="12" height="8" fill="#f59e0b" />
          <rect x="8" y="13" width="12" height="4" fill="#fef3c7" />
          <rect x="10" y="11" width="2" height="2" fill="#18181b" />
          <rect x="16" y="11" width="2" height="2" fill="#18181b" />
          <rect x="13" y="13" width="2" height="2" fill="#18181b" />
          <rect x="9" y="17" width="10" height="7" fill="#eab308" />
          <rect x="9" y="24" width="4" height="2" fill="#fef3c7" />
          <rect x="15" y="24" width="4" height="2" fill="#fef3c7" />
          <rect x="5" y="13" width="4" height="3" fill="#f59e0b" />
          <rect x="4" y="12" width="2" height="4" fill="#fef3c7" />
        </svg>
      </div>
    </div>
  );
}
