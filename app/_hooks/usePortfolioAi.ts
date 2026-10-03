import { useCallback, useEffect, useState } from "react";
import { PORTFOLIO_SANITIZER, sanitizeHtml } from "../_lib/html-sanitizer";
import { usePromptAPI } from "./usePromptAPI";

// ─── Constants ───────────────────────────────────────────────────────────────

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

function sanitizeCanvas(html: string): string {
  const withoutFences = html
    .replace(/^\s*```(?:html)?\s*/i, "")
    .replace(/\s*```\s*$/i, "");
  return sanitizeHtml(withoutFences, PORTFOLIO_SANITIZER);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePortfolioAi() {
  const [canvas, setCanvas] = useState(INIT_CANVAS);
  const [question, setQuestion] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const promptApi = usePromptAPI({
    autoReloadOnDownload: true,
  });

  const {
    phase,
    isReady,
    isGenerating,
    error: generationError,
    contextUsage,
    contextWindow,
    contextPercent,
    statusLabel,
    initialize,
    promptStreaming,
    stop,
    reset,
    clearError,
  } = promptApi;

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        const source = await fetch("/portfolio.md").then((response) => {
          if (!response.ok) throw new Error("The portfolio could not be loaded.");
          return response.text();
        });

        if (cancelled) return;

        const session = await initialize(
          [{ role: "system", content: `${SYSTEM_PROMPT}\n${source}` }],
        );

        if (!session || cancelled) return;

        // Generate suggestions using cloned session so main session context remains clean
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
      } catch (err) {
        console.error(err);
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, [initialize]);

  const generateAnswer = useCallback(
    async (requestedQuestion: string) => {
      const request = `Answer the visitor's question directly: "${requestedQuestion}" Use the portfolio source as your only evidence. Explain the relevant connections, reasoning, or tradeoffs when the source supports them. Do not merely list experience. Present the answer as a thoughtful, focused portfolio canvas in semantic HTML. Return semantic HTML only.`;

      try {
        await promptStreaming(request, {
          onChunk: (_chunk, cumulative) => {
            setCanvas(sanitizeCanvas(cumulative));
          },
        });
      } catch {
        // error state is managed by usePromptAPI
      }
    },
    [promptStreaming],
  );

  const handleQuestion = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = question.trim();
      if (!trimmed) return;
      if (!isReady) return;
      setQuestion("");
      void generateAnswer(trimmed);
    },
    [generateAnswer, isReady, question],
  );

  const handleSuggestionSelect = useCallback(
    (selected: string) => {
      if (!isReady || isGenerating) return;
      setQuestion("");
      void generateAnswer(selected);
    },
    [generateAnswer, isGenerating, isReady],
  );

  return {
    phase,
    canvas,
    question,
    suggestions,
    isReady,
    isGenerating,
    generationError,
    contextUsage,
    contextWindow,
    contextPercent,
    statusLabel,
    onQuestionChange: setQuestion,
    onQuestion: handleQuestion,
    onSuggestionSelect: handleSuggestionSelect,
    onStop: stop,
    onReset: reset,
    onDismissError: clearError,
  };
}

export default usePortfolioAi;
