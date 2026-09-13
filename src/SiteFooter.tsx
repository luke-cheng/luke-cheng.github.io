import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Content and layout are generated locally by your browser's AI. Changing
        views may generate new content.
      </p>
      <div className="footer-links">
        <a
          href="https://github.com/Luke-Cheng"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub/Luke-Cheng"
        >
          <GitHubIcon fontSize="inherit" aria-hidden="true" />
        </a>
        <a
          href="https://www.linkedin.com/in/luke-cheng/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          title="In/Luke-Cheng"
        >
          <LinkedInIcon fontSize="inherit" aria-hidden="true" />
        </a>
        <a
          href="/?page=portfolio"
          aria-label="Resume"
          title="Luke-Cheng-Resume.md"
        >
          <DescriptionOutlinedIcon fontSize="inherit" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

export default SiteFooter;
