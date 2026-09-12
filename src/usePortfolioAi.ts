import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
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
const fallbackCanvas = `<article class="landing-canvas"><p class="eyebrow">Luke's website</p><h1>Click a tab above.</h1><p>And get your on-device AI to generate this site.</p></article>`;
const systemPrompt = `You are the local portfolio editor for Luke Cheng. The complete source of truth is the portfolio markdown supplied below. Never invent facts, companies, dates, metrics, technologies, links, or responsibilities. You may make the presentation surprising and editorial, but every factual claim must be traceable to the source.

For canvas requests, return only semantic HTML and inline style attributes for layout. Make the composition feel like a thoughtful personal website, not a generic resume.

Structure every canvas response in a concise conversation flow.

Portfolio source:
`;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getStatusLabel(
  availability: Availability | "checking",
  isReady: boolean,
) {
  if (availability === "checking") return "Checking local model";
  if (availability === "available") {
    return isReady ? "Local AI ready" : "Waking up local AI";
  }
  if (availability === "downloadable") {
    return "Preparing local model download";
  }
  if (availability === "downloading") return "Downloading local model";
  return "Chrome AI unavailable";
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

export function usePortfolioAi() {
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
  const generationSessionRef = useRef<PromptSession | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const generationIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const createSession = async (source: string, refreshWhenReady = false) => {
      if (!window.LanguageModel) return;
      try {
        const session = await window.LanguageModel.create({
          ...modelOptions,
          initialPrompts: [
            { role: "system", content: `${systemPrompt}\n${source}` },
          ],
          monitor: (monitor) =>
            monitor.addEventListener("downloadprogress", (event) =>
              setProgress(event.loaded),
            ),
        });
        if (cancelled) {
          session.destroy();
          return;
        }
        sessionRef.current = session;
        setIsReady(true);
        setAvailability("available");
        if (refreshWhenReady) {
          window.location.reload();
          return;
        }
        const tabSession = await session.clone();
        try {
          const result = await tabSession.prompt(
            "Create exactly three concise navigation tabs for this portfolio. Return JSON matching the requested schema.",
            { responseConstraint: tabSchema },
          );
          const parsed = JSON.parse(result) as { tabs?: PortfolioTab[] };
          if (!cancelled && parsed.tabs?.length === 3) setTabs(parsed.tabs);
        } finally {
          tabSession.destroy();
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setError(getErrorMessage(error));
      }
    };

    const boot = async () => {
      try {
        const [source, status] = await Promise.all([
          fetch("/portfolio.md").then((response) => {
            if (!response.ok) {
              throw new Error("The portfolio could not be loaded.");
            }
            return response.text();
          }),
          window.LanguageModel?.availability(modelOptions) ??
            Promise.resolve("unavailable" as const),
        ]);
        if (cancelled) return;
        setAvailability(status);
        switch (status) {
          case "available":
            await createSession(source);
            break;
          case "downloadable":
          case "downloading":
            await createSession(source, true);
            break;
          case "unavailable":
            break;
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setError(getErrorMessage(error));
      }
    };

    void boot();
    return () => {
      cancelled = true;
      generationIdRef.current += 1;
      abortRef.current?.abort();
      generationSessionRef.current?.destroy();
      sessionRef.current?.destroy();
    };
  }, []);

  const generateCanvas = async (tab: PortfolioTab, requestedQuestion = "") => {
    const mainSession = sessionRef.current;
    if (!mainSession) return;
    const generationId = generationIdRef.current + 1;
    generationIdRef.current = generationId;
    abortRef.current?.abort();
    generationSessionRef.current?.destroy();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);
    setError("");
    let output = "";
    let session: PromptSession | null = null;
    try {
      session = await mainSession.clone();
      if (generationId !== generationIdRef.current) {
        session.destroy();
        return;
      }
      generationSessionRef.current = session;
      const request = requestedQuestion
        ? `Answer the visitor's question directly: “${requestedQuestion}” Use the portfolio source as your only evidence. The selected lens is “${tab.label}”, which may influence emphasis but must not turn the answer into a generic resume. Explain the relevant connections, reasoning, or tradeoffs when the source supports them. Do not merely list experience. Present the answer as a thoughtful, focused portfolio canvas in semantic HTML. Return semantic HTML only.`
        : `Compose the main portfolio canvas for the view “${tab.label}”. ${tab.prompt} Use a clear hierarchy, one unusual but usable layout, and only facts from the source. Return semantic HTML only.`;
      for await (const chunk of session.promptStreaming(request, {
        signal: controller.signal,
      })) {
        if (generationId !== generationIdRef.current) return;
        output += chunk;
        setCanvas(sanitizeCanvas(output));
      }
    } catch (generationError) {
      if (
        generationId === generationIdRef.current &&
        (generationError as Error).name !== "AbortError"
      ) {
        console.error(generationError);
        setError(getErrorMessage(generationError));
      }
    } finally {
      session?.destroy();
      if (
        generationId === generationIdRef.current &&
        generationSessionRef.current === session
      ) {
        generationSessionRef.current = null;
        setIsGenerating(false);
      }
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
  const statusLabel = getStatusLabel(availability, isReady);

  return {
    tabs,
    activeTab,
    question,
    statusLabel,
    isReady,
    isGenerating,
    availability,
    progress,
    canvas,
    error,
    onTabChange: handleTabChange,
    onQuestionChange: setQuestion,
    onQuestion: handleQuestion,
    onStop: () => abortRef.current?.abort(),
    onReset: () => window.location.reload(),
    onDismissError: () => setError(""),
  };
}
