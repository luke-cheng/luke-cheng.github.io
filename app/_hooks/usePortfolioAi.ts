import { useEffect, useRef, useState } from "react";
import type { AiError, AiPhase } from "../_lib/types";
import { PORTFOLIO_SANITIZER, sanitizeHtml } from "../_lib/html-sanitizer";

// ─── Constants ───────────────────────────────────────────────────────────────

const MODEL_OPTIONS: LanguageModelCreateCoreOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

const SUGGESTIONS_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: { type: "string", minLength: 12, maxLength: 100 },
    },
  },
  required: ["questions"],
};

const INIT_CANVAS = `<article class="landing-canvas"><p class="eyebrow">Luke Cheng</p><h1>Programmer by trade.<br/>
Chemist by training.<br/>
Philosopher by heart.<br/>
Driven by curiosity about how our worlds work.</h1><p>Use the navigation above to explore or ask a question.</p></article>`;

const SYSTEM_PROMPT = `You are the local portfolio editor for Luke Cheng. The complete source of truth is the portfolio markdown supplied below. Never invent facts, companies, dates, metrics, technologies, links, or responsibilities. You may make the presentation surprising and editorial, but every factual claim must be traceable to the source.

For canvas requests, return only semantic HTML and inline style attributes for layout. Make the composition feel like a thoughtful personal website, not a generic resume.

Structure every canvas response in a concise conversation flow.

Portfolio source:
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toAiError(error: unknown): AiError {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return { name: "Error", message: String(error) };
}

function getStatusLabel(phase: AiPhase, isGenerating: boolean): string {
  switch (phase.status) {
    case "checking":      return "Checking local model";
    case "downloadable":  return "Preparing local model download";
    case "downloading":   return "Downloading local model";
    case "unavailable":   return "Chrome AI unavailable";
    case "error":         return "Chrome AI setup failed";
    case "ready":         return isGenerating ? "Generating…" : "Chrome on-device AI ready";
  }
}

function sanitizeCanvas(html: string): string {
  const withoutFences = html
    .replace(/^\s*```(?:html)?\s*/i, "")
    .replace(/\s*```\s*$/i, "");
  return sanitizeHtml(withoutFences, PORTFOLIO_SANITIZER);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePortfolioAi() {
  const [phase, setPhase] = useState<AiPhase>({ status: "checking" });
  const [canvas, setCanvas] = useState(INIT_CANVAS);
  const [question, setQuestion] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<AiError | null>(null);

  const sessionRef = useRef<LanguageModel | null>(null);
  const generationSessionRef = useRef<LanguageModel | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const generationIdRef = useRef(0);

  const isReady = phase.status === "ready";

  useEffect(() => {
    let cancelled = false;

    const createSession = async (source: string, refreshWhenReady = false) => {
      if (typeof LanguageModel === "undefined") return;

      let session: LanguageModel;
      try {
        session = await LanguageModel.create({
          ...MODEL_OPTIONS,
          initialPrompts: [
            { role: "system", content: `${SYSTEM_PROMPT}\n${source}` },
          ],
          monitor: (monitor) =>
            monitor.addEventListener("downloadprogress", (e) =>
              setPhase({ status: "downloading", progress: e.loaded }),
            ),
        });
      } catch (err) {
        console.error(err);
        setPhase({ status: "error", error: toAiError(err) });
        return;
      }

      if (cancelled) {
        session.destroy();
        return;
      }

      sessionRef.current = session;
      setPhase({ status: "ready" });

      if (refreshWhenReady) {
        window.location.reload();
        return;
      }

      // Generate suggestions
      const suggestionSession = await session.clone();
      try {
        const result = await suggestionSession.prompt(
          "Create 2 to 5 concise generic one sentence questions a visitor might ask about this portfolio. Return JSON matching the requested schema.",
          { responseConstraint: SUGGESTIONS_SCHEMA },
        );
        const parsed = JSON.parse(result) as { questions?: unknown[] };
        const generated = parsed.questions
          ?.filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 4);
        if (!cancelled && generated?.length) setSuggestions(generated);
      } catch (err) {
        console.error("Suggestion generation failed:", err);
      } finally {
        suggestionSession.destroy();
      }
    };

    const boot = async () => {
      // If the API doesn't exist at all, show "browser not supported" immediately.
      if (typeof LanguageModel === "undefined") {
        setPhase({ status: "unavailable" });
        return;
      }

      try {
        const [source, status] = await Promise.all([
          fetch("/portfolio.md").then((r) => {
            if (!r.ok) throw new Error("The portfolio could not be loaded.");
            return r.text();
          }),
          LanguageModel.availability(MODEL_OPTIONS),
        ]);

        if (cancelled) return;

        switch (status) {
          case "available":
            setPhase({ status: "checking" });
            await createSession(source);
            break;
          case "downloadable":
            setPhase({ status: "downloadable", progress: 0 });
            await createSession(source, true);
            break;
          case "downloading":
            setPhase({ status: "downloading", progress: 0 });
            await createSession(source, true);
            break;
          case "unavailable":
            // API exists but availability() says the device can't run it.
            // Attempt create() anyway so Chrome throws the real error with
            // the actual reason (disk space, VRAM, etc.) rather than us guessing.
            await createSession(source);
            break;
        }
      } catch (err) {
        console.error(err);
        setPhase({ status: "error", error: toAiError(err) });
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

  const generateAnswer = async (requestedQuestion: string) => {
    const mainSession = sessionRef.current;
    if (!mainSession) return;

    const generationId = ++generationIdRef.current;
    abortRef.current?.abort();
    generationSessionRef.current?.destroy();

    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    setGenerationError(null);

    let session: LanguageModel | null = null;
    let output = "";

    try {
      session = await mainSession.clone();

      if (generationId !== generationIdRef.current) {
        session.destroy();
        return;
      }

      generationSessionRef.current = session;

      const request = `Answer the visitor's question directly: "${requestedQuestion}" Use the portfolio source as your only evidence. Explain the relevant connections, reasoning, or tradeoffs when the source supports them. Do not merely list experience. Present the answer as a thoughtful, focused portfolio canvas in semantic HTML. Return semantic HTML only.`;

      const stream = session.promptStreaming(request, { signal: controller.signal });
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (generationId !== generationIdRef.current) return;
          output += value;
          setCanvas(sanitizeCanvas(output));
        }
      } finally {
        reader.releaseLock();
      }
    } catch (err) {
      if (generationId === generationIdRef.current && (err as Error).name !== "AbortError") {
        console.error(err);
        setGenerationError(toAiError(err));
      }
    } finally {
      session?.destroy();
      if (generationId === generationIdRef.current && generationSessionRef.current === session) {
        generationSessionRef.current = null;
        setIsGenerating(false);
      }
    }
  };

  const handleQuestion = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    if (!isReady) {
      setGenerationError({ name: "Error", message: "On-device AI is not ready yet. Try again once Chrome AI becomes available." });
      return;
    }
    setQuestion("");
    void generateAnswer(trimmed);
  };

  const handleSuggestionSelect = (selected: string) => {
    if (!isReady || isGenerating) return;
    setQuestion("");
    void generateAnswer(selected);
  };

  return {
    phase,
    canvas,
    question,
    suggestions,
    isReady,
    isGenerating,
    generationError,
    statusLabel: getStatusLabel(phase, isGenerating),
    onQuestionChange: setQuestion,
    onQuestion: handleQuestion,
    onSuggestionSelect: handleSuggestionSelect,
    onStop: () => abortRef.current?.abort(),
    onReset: () => window.location.reload(),
    onDismissError: () => setGenerationError(null),
  };
}
