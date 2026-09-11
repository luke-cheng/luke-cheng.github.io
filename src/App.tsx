import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import "./App.css";
import CanvasArea from "./CanvasArea";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import type { Availability, PortfolioTab, PromptSession } from "./types";

const modelOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};
const tabSchema = {
  type: "object",
  properties: {
    tabs: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          prompt: { type: "string" },
        },
        required: ["id", "label", "prompt"],
      },
    },
  },
  required: ["tabs"],
};
const fallbackTabs: PortfolioTab[] = [
  {
    id: "systems",
    label: "Systems at scale",
    prompt: "Focus on professional engineering experience and impact.",
  },
  {
    id: "experiments",
    label: "Side experiments",
    prompt:
      "Focus on personal projects, product work, and technical curiosity.",
  },
  {
    id: "outside",
    label: "Outside the stack",
    prompt: "Focus on leadership, interests, and the ideas behind the work.",
  },
];
const fallbackCanvas = `<article class="landing-canvas"><p class="eyebrow">Luke's website</p><h1>Click a tab above.</h1><p>And get your browser AI to work.</p></article>`;
const systemPrompt = `You are the local portfolio editor for Luke Cheng. The complete source of truth is the portfolio markdown supplied below. Never invent facts, companies, dates, metrics, technologies, links, or responsibilities. You may make the presentation surprising and editorial, but every factual claim must be traceable to the source.

For canvas requests, return only semantic HTML and inline style attributes for layout. Never return markdown, code fences, script, style, iframe, form controls, SVG, images, event handlers, or javascript URLs. Use only article, aside, div, section, header, h1, h2, h3, p, ul, ol, li, a, strong, em, small, time, dl, dt, and dd. Make the composition feel like a thoughtful personal website, not a generic resume.

Structure every canvas response in exactly this order: Summary, Why, then How. Use a clear heading for each section. Summary states the main point or answer. Why explains the relevant context, reasoning, or significance. How explains the implementation, process, or specific evidence from the portfolio. When a section is not applicable, keep it concise rather than inventing information.

Portfolio source:
`;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function sanitizeCanvas(html: string) {
  const withoutFences = html
    .replace(/^\s*```(?:html)?\s*/i, "")
    .replace(/\s*```\s*$/i, "");
  return DOMPurify.sanitize(withoutFences, {
    ALLOWED_TAGS: [
      "article",
      "aside",
      "div",
      "section",
      "header",
      "h1",
      "h2",
      "h3",
      "p",
      "ul",
      "ol",
      "li",
      "a",
      "strong",
      "em",
      "small",
      "time",
      "dl",
      "dt",
      "dd",
      "br",
    ],
    ALLOWED_ATTR: ["class", "href", "target", "rel", "style"],
    FORBID_ATTR: ["onclick", "onload", "onerror"],
  });
}

function App() {
  const [portfolio, setPortfolio] = useState("");
  const [tabs, setTabs] = useState(fallbackTabs);
  const [activeTab, setActiveTab] = useState(fallbackTabs[0].id);
  const [canvas, setCanvas] = useState(fallbackCanvas);
  const [question, setQuestion] = useState("");
  const [availability, setAvailability] = useState<Availability | "checking">(
    "checking",
  );
  const [isReady, setIsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const sessionRef = useRef<PromptSession | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const createSession = async (source: string) => {
    if (!window.LanguageModel) return;
    try {
      const session = await window.LanguageModel.create({
        initialPrompts: [
          { role: "system", content: `${systemPrompt}\n${source}` },
        ],
        monitor: (monitor) =>
          monitor.addEventListener("downloadprogress", (event) =>
            setProgress(event.loaded),
          ),
      });
      sessionRef.current = session;
      setIsReady(true);
      setAvailability("available");
      const result = await session.prompt(
        "Create exactly three concise navigation tabs for this portfolio. Return JSON matching the requested schema.",
        { responseConstraint: tabSchema },
      );
      const parsed = JSON.parse(result) as { tabs?: PortfolioTab[] };
      if (parsed.tabs?.length === 3) setTabs(parsed.tabs);
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const [source, status] = await Promise.all([
          fetch("/portfolio.md").then((response) => response.text()),
          window.LanguageModel?.availability(modelOptions) ??
            Promise.resolve("unavailable" as const),
        ]);
        if (cancelled) return;
        setPortfolio(source);
        setAvailability(status);
        if (status === "available") await createSession(source);
      } catch (error) {
        console.error(error);
        if (!cancelled) setError(getErrorMessage(error));
      }
    };
    void boot();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
      sessionRef.current?.destroy();
    };
  }, []);

  const activateModel = () => {
    if (portfolio) {
      setError("");
      setAvailability("downloading");
      void createSession(portfolio);
    }
  };
  const generateCanvas = async (tab: PortfolioTab, requestedQuestion = "") => {
    const session = sessionRef.current;
    if (!session) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);
    setError("");
    let output = "";
    try {
      const request = requestedQuestion
        ? `Answer the visitor's question directly: “${requestedQuestion}” Use the portfolio source as your only evidence. The selected lens is “${tab.label}”, which may influence emphasis but must not turn the answer into a generic resume. Explain the relevant connections, reasoning, or tradeoffs when the source supports them. Do not merely list experience. Present the answer as a thoughtful, focused portfolio canvas in semantic HTML. Return semantic HTML only.`
        : `Compose the main portfolio canvas for the view “${tab.label}”. ${tab.prompt} Use a clear hierarchy, one unusual but usable layout, and only facts from the source. Return semantic HTML only.`;
      for await (const chunk of session.promptStreaming(request, {
        signal: controller.signal,
      })) {
        output += chunk;
        setCanvas(sanitizeCanvas(output));
      }
    } catch (generationError) {
      if ((generationError as Error).name !== "AbortError") {
        console.error(generationError);
        setError(getErrorMessage(generationError));
      }
    } finally {
      setIsGenerating(false);
    }
  };
  const handleTabChange = (tab: PortfolioTab) => {
    setActiveTab(tab.id);
    void generateCanvas(tab);
  };
  const handleQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    if (!isReady) {
      setError(
        "Local AI is not ready yet. Your question is ready when Chrome AI becomes available.",
      );
      return;
    }
    setQuestion("");
    const tab = tabs.find((item) => item.id === activeTab) ?? tabs[0];
    void generateCanvas(tab, trimmedQuestion);
  };
  const statusLabel =
    availability === "checking"
      ? "Checking local model"
      : availability === "available" && isReady
        ? "Local AI ready"
        : availability === "downloading"
          ? "Downloading local model"
          : availability === "unavailable"
            ? "Chrome AI unavailable"
            : "Local model available";

  return (
    <div className={`site-shell ${isGenerating ? "is-generating" : ""}`}>
      <SiteHeader
        tabs={tabs}
        activeTab={activeTab}
        question={question}
        statusLabel={statusLabel}
        isReady={isReady}
        isGenerating={isGenerating}
        onTabChange={handleTabChange}
        onQuestionChange={setQuestion}
        onQuestion={handleQuestion}
        onStop={() => abortRef.current?.abort()}
        onReset={() => window.location.reload()}
      />
      <CanvasArea
        isReady={isReady}
        isGenerating={isGenerating}
        availability={availability}
        progress={progress}
        canvas={canvas}
        error={error}
        onActivate={activateModel}
        onDismissError={() => setError("")}
      />
      <SiteFooter />
    </div>
  );
}

export default App;
