import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  ReadCvLogoIcon,
} from "@phosphor-icons/react";

function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        This website is proudly powered by your browser&#39;s on-device AI.
      </p>
      <nav className="footer-links" aria-label="Luke Cheng links">
        <a
          href="https://github.com/Luke-Cheng"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub/Luke-Cheng"
        >
          <GithubLogoIcon fontSize="inherit" aria-hidden="true" />
        </a>
        <a
          href="https://www.linkedin.com/in/luke-cheng/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="In/Luke-Cheng"
        >
          <LinkedinLogoIcon fontSize="inherit" aria-hidden="true" />
        </a>
        <a
          href="/portfolio.md"
          // download="Luke_Cheng-CV.md"
          aria-label="Luke Cheng CV"
          title="Luke_Cheng-CV.md"
        >
          <ReadCvLogoIcon fontSize="inherit" aria-hidden="true" />
        </a>
      </nav>
    </footer>
  );
}

export default SiteFooter;
