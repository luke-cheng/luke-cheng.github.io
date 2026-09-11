function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        <span className="footer-signal" /> Content and layout are generated
        locally by your browser’s AI. Changing views may generate new content.
      </p>
      <div className="footer-links">
        <a href="https://github.com/Luke-Cheng" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a
          href="https://www.linkedin.com/in/luke-cheng/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>
        <a href="/portfolio.md">View source ↗</a>
      </div>
    </footer>
  );
}

export default SiteFooter;
