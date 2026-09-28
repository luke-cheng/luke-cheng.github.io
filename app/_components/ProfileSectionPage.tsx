"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import type { SitePage } from "../_lib/types";
import { MARKDOWN_SANITIZER, sanitizeHtml } from "../_lib/html-sanitizer";

type ProfileSectionPageProps = {
  page: Exclude<SitePage, "home" | "thoughts">;
};

const SECTION_TITLES: Record<ProfileSectionPageProps["page"], string[]> = {
  work: ["Experience"],
  interests: ["Leadership & Activities", "Interests & Hobbies"],
};

function pickSections(markdown: string, titles: string[]) {
  const selectedTitles = new Set(titles);
  let includeSection = false;

  return markdown
    .split(/\r?\n/)
    .filter((line) => {
      const heading = line.match(/^##\s+(.+)$/);
      if (heading) includeSection = selectedTitles.has(heading[1].trim());
      return includeSection;
    })
    .join("\n");
}

function ProfileSectionPage({ page }: ProfileSectionPageProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const title = page === "work" ? "Work" : "Interests";
  const intro = page === "work"
    ? "Work experience"
    : "Interests, activities, and things I think about.";

  useEffect(() => {
    fetch("/portfolio.md")
      .then((response) => {
        if (!response.ok) throw new Error("The portfolio content could not be loaded.");
        return response.text();
      })
      .then((markdown) => {
        const sections = pickSections(markdown, SECTION_TITLES[page]);
        setContent(sanitizeHtml(marked.parse(sections) as string, MARKDOWN_SANITIZER));
      })
      .catch((loadError: Error) => setError(loadError.message));
  }, [page]);

  return (
    <main className="profile-content">
      <p className="eyebrow">{title}</p>
      <h1>{intro}</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <article dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </main>
  );
}

export default ProfileSectionPage;
