"use client";

import { useEffect, useState } from "react";
import GenerationNotice from "./GenerationNotice";
import type { ProfilePage } from "../_lib/profile.server";
import { renderMarkdown } from "../_lib/markdown";
import { MARKDOWN_SANITIZER, sanitizeHtml } from "../_lib/html-sanitizer";

type ProfileSectionPageProps = {
  page: ProfilePage;
  source: string;
  staticHtml: string;
};

const MODEL_OPTIONS: LanguageModelCreateCoreOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

function ProfileSectionPage({ page, source, staticHtml }: ProfileSectionPageProps) {
  const title = page === "work" ? "Work" : "Interests";
  const intro = page === "work"
    ? "Work experience"
    : "Interests, activities, and things I think about.";
  const [content, setContent] = useState(staticHtml);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let active = true;
    let session: LanguageModel | null = null;

    const generateProfile = async () => {
      if (typeof LanguageModel === "undefined") return;

      setIsGenerating(true);
      try {
        session = await LanguageModel.create(MODEL_OPTIONS);
        const generated = await session.prompt(
          `Turn this portfolio section into a concise, thoughtful ${title.toLowerCase()} page. Preserve every factual claim and do not invent details, dates, metrics, or responsibilities. Improve the hierarchy and readability, but keep all useful information. Return Markdown only.\n\nPortfolio section:\n${source}`,
        );
        if (active) {
          setContent(sanitizeHtml(renderMarkdown(generated), MARKDOWN_SANITIZER));
        }
      } catch {
        // The static HTML is intentionally retained when on-device AI is unavailable or fails.
      } finally {
        session?.destroy();
        if (active) setIsGenerating(false);
      }
    };

    void generateProfile();
    return () => {
      active = false;
      session?.destroy();
    };
  }, [source, staticHtml, title]);

  return (
    <main className="profile-content">
      <p className="eyebrow">{title}</p>
      <h1>{intro}</h1>
      {isGenerating && (
        <GenerationNotice
          title={`Tailoring ${title.toLowerCase()}...`}
          description="On-device AI is working on this section"
        />
      )}
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
}

export default ProfileSectionPage;
