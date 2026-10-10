"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseIcon, ChatCircleDotsIcon, LightbulbIcon, PersonSimpleSkiIcon } from "@phosphor-icons/react";

type SitePage = "home" | "work" | "interests" | "thoughts" | "chat";

function getCurrentPage(pathname: string): SitePage {
  if (pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/interests")) return "interests";
  if (pathname.startsWith("/thoughts")) return "thoughts";
  if (pathname.startsWith("/chat")) return "chat";
  return "home";
}

function StaticNavigation({ page }: { page: SitePage }) {
  return (
    <>
      <Link
        className={`ui-button ui-button--tab ${page === "chat" ? "active" : ""}`}
        href="/chat/"
        aria-current={page === "chat" ? "page" : undefined}>
        <ChatCircleDotsIcon /> Chat
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "work" ? "active" : ""}`}
        href="/work/"
        aria-current={page === "work" ? "page" : undefined}
      >
        <BriefcaseIcon /> Work
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "interests" ? "active" : ""}`}
        href="/interests/"
        aria-current={page === "interests" ? "page" : undefined}
      >
        <PersonSimpleSkiIcon /> Interests
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "thoughts" ? "active" : ""}`}
        href="/thoughts/"
        aria-current={page === "thoughts" ? "page" : undefined}
      >
        <LightbulbIcon /> Thoughts
      </Link>
    </>
  );
}

function SiteHeader() {
  const page = getCurrentPage(usePathname() ?? "/");

  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="ui-button ui-button--identity" href="/">
          <strong>Luke Cheng</strong>
        </Link>
        <nav className="tab-nav" aria-label="Site navigation">
          <StaticNavigation page={page} />
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
