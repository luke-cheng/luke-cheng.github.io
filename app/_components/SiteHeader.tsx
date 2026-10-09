import Link from "next/link";

export type SitePage = "chat" | "work" | "interests" | "thoughts";

export type SiteHeaderProps = {
  page: SitePage;
};

function StaticNavigation({ page }: { page: SiteHeaderProps["page"] }) {
  return (
    <>
      <Link
        className={`ui-button ui-button--tab ${page === "chat" ? "active" : ""}`}
        href="/chat/"
        aria-current={page === "chat" ? "page" : undefined}
      >
        <span>00</span>
        AI Chat
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "work" ? "active" : ""}`}
        href="/work/"
        aria-current={page === "work" ? "page" : undefined}
      >
        <span>01</span>
        Work
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "interests" ? "active" : ""}`}
        href="/interests/"
        aria-current={page === "interests" ? "page" : undefined}
      >
        <span>02</span>
        Interests
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "thoughts" ? "active" : ""}`}
        href="/thoughts/"
        aria-current={page === "thoughts" ? "page" : undefined}
      >
        <span>03</span>
        Thoughts
      </Link>
    </>
  );
}

function SiteHeader(props: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="ui-button ui-button--identity" href="/chat/">
          <strong>Luke Cheng</strong>
        </Link>
        <nav className="tab-nav" aria-label="Site navigation">
          <StaticNavigation page={props.page} />
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
