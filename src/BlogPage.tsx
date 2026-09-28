import { useCallback, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import SiteFooter from "./SiteFooter";

type BlogPost = {
  slug: string;
  file: string;
  title: string;
  date: string;
  description: string;
};

const MODEL_OPTIONS: LanguageModelCreateCoreOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

function render(markdown: string) {
  return DOMPurify.sanitize(marked.parse(markdown) as string);
}

function withoutFrontMatter(markdown: string) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [article, setArticle] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);
  const [error, setError] = useState("");
  const [expansionError, setExpansionError] = useState("");
  const sessionRef = useRef<LanguageModel | null>(null);

  const openPost = useCallback(async (post: BlogPost) => {
    let didLoadDraft = false;
    setActivePost(post);
    setError("");
    setExpansionError("");
    setArticle("");
    setIsExpanding(false);

    try {
      const response = await fetch(`/${post.file}`);
      if (!response.ok) throw new Error("This draft could not be loaded.");
      const draft = await response.text();
      setArticle(render(withoutFrontMatter(draft)));
      didLoadDraft = true;

      if (typeof LanguageModel === "undefined") return;
      setIsExpanding(true);
      sessionRef.current?.destroy();
      const session = await LanguageModel.create(MODEL_OPTIONS);
      sessionRef.current = session;
      const expanded = await session.prompt(
        `Expand the following markdown draft into a complete, thoughtful blog article. Keep every factual claim grounded in the draft; do not invent events, companies, results, or personal details. Preserve the author's direct, reflective voice. Return Markdown only.\n\n${draft}`,
      );
      if (sessionRef.current === session) setArticle(render(expanded));
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : String(loadError);
      if (didLoadDraft) setExpansionError(message);
      else setError(message);
    } finally {
      setIsExpanding(false);
    }
  }, []);

  useEffect(() => {
    fetch("/blog/index.json")
      .then((response) => {
        if (!response.ok) throw new Error("The blog index could not be loaded.");
        return response.json() as Promise<BlogPost[]>;
      })
      .then(setPosts)
      .catch((loadError: Error) => setError(loadError.message));

    return () => sessionRef.current?.destroy();
  }, []);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("post");
    if (!slug || !posts.length) return;

    const post = posts.find((item) => item.slug === slug);
    const timer = window.setTimeout(() => {
      if (post) void openPost(post);
      else setError("This blog post could not be found.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [openPost, posts]);

  return (
    <div className="blog-page">
      <header className="blog-page-header">
        <a href="/" className="portfolio-back-link">Back to portfolio ↙</a>
        <span className="eyebrow">Luke Cheng / Notes</span>
      </header>
      <main className="blog-layout">
        <section className="blog-index" aria-label="Blog posts">
          <p className="eyebrow">Blog</p>
          <h1>Working notes on systems, tools, and how to make things clearer.</h1>
          {error && !activePost && <p className="error-message">{error}</p>}
          <div className="post-list">
            {posts.map((post) => (
              <a
                className={`post-card ${activePost?.slug === post.slug ? "active" : ""}`}
                href={`/?page=blog&post=${encodeURIComponent(post.slug)}`}
                key={post.slug}
              >
                <time dateTime={post.date}>{post.date}</time>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <span>Read article ↗</span>
              </a>
            ))}
          </div>
        </section>
        <section className="blog-article" aria-live="polite">
          {activePost ? (
            <>
              <a className="all-posts-link" href="/?page=blog">← All posts</a>
              <p className="eyebrow">{isExpanding ? "Expanding draft locally…" : "Article"}</p>
              {error ? <p className="error-message">{error}</p> : <>
                {expansionError && <p className="blog-ai-note">Draft shown — {expansionError}</p>}
                <article dangerouslySetInnerHTML={{ __html: article }} />
              </>}
            </>
          ) : <p className="blog-placeholder">Select a note to read the draft, then let on-device AI develop it into an article.</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default BlogPage;
