import { marked, Renderer } from "marked";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(href: string) {
  const normalized = href.trim().replace(/[\u0000-\u0020]+/g, "");
  const scheme = normalized.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();

  if (scheme && !["http", "https", "mailto", "tel"].includes(scheme)) return null;
  return href;
}

const renderer = new Renderer();
renderer.html = ({ text }) => escapeHtml(text);
renderer.link = function ({ href, title, tokens }) {
  const safe = safeHref(href);
  if (!safe) return this.parser.parseInline(tokens);

  const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
  return `<a href="${escapeHtml(safe)}"${titleAttribute}>${this.parser.parseInline(tokens)}</a>`;
};
renderer.image = ({ href, title, text }) => {
  const safe = safeHref(href);
  if (!safe) return escapeHtml(text);

  const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
  return `<img src="${escapeHtml(safe)}" alt="${escapeHtml(text)}"${titleAttribute}>`;
};

export function renderMarkdown(markdown: string) {
  return marked.parse(markdown, { async: false, renderer });
}

export function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}
