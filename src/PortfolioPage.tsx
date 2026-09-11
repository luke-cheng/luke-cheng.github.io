import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import SiteFooter from "./SiteFooter";

function PortfolioPage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/portfolio.md")
      .then((response) => {
        if (!response.ok) throw new Error("The portfolio could not be loaded.");
        return response.text();
      })
      .then((markdown) =>
        setContent(DOMPurify.sanitize(marked.parse(markdown) as string)),
      )
      .catch((loadError) => setError(loadError.message));
  }, []);

  return (
    <div className="portfolio-page">
      <header className="portfolio-page-header">
        <a href="/" className="portfolio-back-link">
          Back to portfolio ↙
        </a>
        <span className="eyebrow">Luke Cheng / Resume</span>
      </header>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <article
          className="portfolio-markdown"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      <SiteFooter />
    </div>
  );
}

export default PortfolioPage;