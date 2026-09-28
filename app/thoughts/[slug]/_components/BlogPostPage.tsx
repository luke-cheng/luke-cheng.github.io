"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/app/_lib/blog.server";
import { renderMarkdown } from "@/app/_lib/markdown";
import { MARKDOWN_SANITIZER, sanitizeHtml } from "@/app/_lib/html-sanitizer";
import GenerationNotice from "@/app/_components/GenerationNotice";

type BlogPostPageProps = {
  post: BlogPost;
  draft: string;
  initialArticleHtml: string;
};

const MODEL_OPTIONS: LanguageModelCreateCoreOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

function BlogPostPage({ post, draft, initialArticleHtml }: BlogPostPageProps) {
  const [article, setArticle] = useState(initialArticleHtml);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expansionError, setExpansionError] = useState("");

  useEffect(() => {
    let active = true;
    let session: LanguageModel | null = null;
    setArticle(initialArticleHtml);

    const expandDraft = async () => {
      if (typeof LanguageModel === "undefined") {
        setExpansionError("On-device AI is unavailable in this browser.");
        return;
      }

      setIsExpanding(true);
      try {
        session = await LanguageModel.create(MODEL_OPTIONS);
        if (!active) {
          session.destroy();
          return;
        }

        const expanded = await session.prompt(
          `Turn this blog draft into a complete article. Treat the draft as the wireframe: keep its central idea and point order, use clear section headings to develop the ideas, open with a concise framing paragraph, and end with a short synthesis. Preserve the author's direct, reflective voice. Keep every factual claim grounded in the draft. Do not invent events, examples, research, results, or personal details. Return Markdown only, with the supplied title as the H1.\n\nTitle: ${post.title}\nDescription: ${post.description}\n\nDraft wireframe:\n${draft}`,
        );
        if (active) {
          setArticle(sanitizeHtml(renderMarkdown(expanded), MARKDOWN_SANITIZER));
          setIsExpanded(true);
        }
      } catch (error) {
        if (active) {
          setExpansionError(error instanceof Error ? error.message : String(error));
        }
      } finally {
        session?.destroy();
        if (active) setIsExpanding(false);
      }
    };

    void expandDraft();
    return () => {
      active = false;
      session?.destroy();
    };
  }, [draft, initialArticleHtml, post.description, post.title]);

  return (
    <main className="blog-article-page">
      <Link className="all-posts-link" href="/thoughts/">← All posts</Link>
      {isExpanding ? (
        <GenerationNotice
          title={`Expanding draft...`}
          description="You're on-device AI is tailoring this section"
        />
      ) : (
        <p className="eyebrow">{isExpanded ? "Article" : "Draft"}</p>
      )}
      {expansionError && (
        <p className="blog-ai-note">Showing the original draft. {expansionError}</p>
      )}
      <article dangerouslySetInnerHTML={{ __html: article }} />
    </main>
  );
}

export default BlogPostPage;
