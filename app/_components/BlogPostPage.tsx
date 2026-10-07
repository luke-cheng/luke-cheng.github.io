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
    const storageKey = `blog_post_expanded_${post.slug}`;

    const expandDraft = async () => {
      try {
        const cached = sessionStorage.getItem(storageKey);
        if (cached) {
          if (active) {
            setArticle(cached);
            setIsExpanded(true);
          }
          return;
        }
      } catch {
        // sessionStorage might be restricted or unavailable
      }

      if (typeof LanguageModel === "undefined") {
        if (active) setExpansionError("On-device AI is unavailable in this browser.");
        return;
      }

      setIsExpanding(true);
      try {
        session = await LanguageModel.create(MODEL_OPTIONS);
        if (!active) {
          session.destroy();
          return;
        }

        const stream = session.promptStreaming(
          `Turn this draft into a complete blog post. provided is an extremely rough draft, you'll need to restructure and rewrite it. Keep its central idea close, use clear section headings to develop the ideas, keep it concise as we have tiny attention span in social media era. Return Markdown, with the supplied title as the H1.\n\nTitle: ${post.title}\nDescription: ${post.description}\n\nDraft:\n${draft}`,
        );
        const reader = stream.getReader();
        let expanded = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!active) return;

            expanded += value;
            setArticle(sanitizeHtml(renderMarkdown(expanded), MARKDOWN_SANITIZER));
          }
        } finally {
          reader.releaseLock();
        }

        if (active) {
          const sanitized = sanitizeHtml(renderMarkdown(expanded), MARKDOWN_SANITIZER);
          setIsExpanded(true);
          try {
            sessionStorage.setItem(storageKey, sanitized);
          } catch {
            // Ignore sessionStorage quota or access errors
          }
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
  }, [draft, post.description, post.slug, post.title]);

  return (
    <main className="blog-article-page">
      <Link className="all-posts-link" href="/thoughts/">← All posts</Link>
      {isExpanding ? (
        <GenerationNotice
          title="Writing..."
          description="On-device AI is streaming this draft into a full article"
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
