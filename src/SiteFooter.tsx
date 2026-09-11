import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FilePresentIcon from "@mui/icons-material/FilePresent";
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
          title="GitHub/Luke-Cheng"
        >
          <GitHubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/luke-cheng/"
          target="_blank"
          rel="noreferrer"
          title="In/Luke-Cheng"
        >
          <LinkedInIcon />
        </a>
        <a href="/?page=portfolio" title="Luke-Cheng-Resume.md">
          <FilePresentIcon />
        </a>
      </div>
    </footer>
  );
}

export default SiteFooter;
