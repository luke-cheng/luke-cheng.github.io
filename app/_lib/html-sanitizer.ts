type SanitizerConfig = {
  allowElements: string[];
  allowAttributes: string[];
};

type SetHTMLCapableElement = HTMLDivElement & {
  setHTML?: (input: string, options: { sanitizer: SanitizerConfig }) => void;
};

const SHARED_ELEMENTS = [
  "a", "article", "aside", "blockquote", "br", "code", "dd", "del", "div",
  "dl", "dt", "em", "h1", "h2", "h3", "h4", "h5", "h6", "header",
  "hr", "li", "ol", "p", "pre", "section", "small", "span", "strong",
  "table", "tbody", "td", "th", "thead", "time", "tr", "ul",
];

export const PORTFOLIO_SANITIZER: SanitizerConfig = {
  allowElements: SHARED_ELEMENTS,
  allowAttributes: ["class", "href", "rel", "style", "target"],
};

export const MARKDOWN_SANITIZER: SanitizerConfig = {
  allowElements: [...SHARED_ELEMENTS, "img"],
  allowAttributes: ["alt", "class", "href", "rel", "src", "style", "target", "title"],
};

export function sanitizeHtml(html: string, sanitizer: SanitizerConfig) {
  const container = document.createElement("div") as SetHTMLCapableElement;
  if (typeof container.setHTML !== "function") {
    throw new Error("This browser does not support the HTML Sanitizer API.");
  }

  container.setHTML(html, { sanitizer });
  return container.innerHTML;
}
