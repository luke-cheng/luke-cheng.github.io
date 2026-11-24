"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseIcon,
  ChatCircleDotsIcon,
  LightbulbIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@phosphor-icons/react";

type SitePage = "home" | "work" | "thought" | "about" | "chat";

function getCurrentPage(pathname: string): SitePage {
  if (pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/thoughts")) return "thought";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/chat")) return "chat";
  return "home";
}

function StaticNavigation({ page }: { page: SitePage }) {
  return (
    <>
      <Link
        className={`ui-button ui-button--tab ${page === "about" || page === "home" ? "active" : ""}`}
        href="/about/"
        aria-current={page === "about" || page === "home" ? "page" : undefined}
      >
        <UserIcon /> About
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "work" ? "active" : ""}`}
        href="/work/"
        aria-current={page === "work" ? "page" : undefined}
      >
        <BriefcaseIcon /> Work
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "thought" ? "active" : ""}`}
        href="/thoughts/"
        aria-current={page === "thought" ? "page" : undefined}
      >
        <LightbulbIcon /> Thought
      </Link>
      <Link
        className={`ui-button ui-button--tab ${page === "chat" ? "active" : ""}`}
        href="/chat/"
        aria-current={page === "chat" ? "page" : undefined}
      >
        <ChatCircleDotsIcon /> Chat
      </Link>
    </>
  );
}

function SiteHeader() {
  const page = getCurrentPage(usePathname() ?? "/");
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light",
  );

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("luke-theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="ui-button ui-button--identity" href="/">
          <strong>Luke_Cheng</strong>
        </Link>
        <div className="header-controls">
          <nav className="tab-nav" aria-label="Site navigation">
            <StaticNavigation page={page} />
          </nav>
          <button
            className="ui-button ui-button--tab theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            aria-pressed={theme === "dark"}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? (
              <MoonIcon aria-hidden="true" />
            ) : (
              <SunIcon aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
