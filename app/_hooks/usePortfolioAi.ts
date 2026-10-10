import { useCallback, useEffect, useState } from "react";
import { PORTFOLIO_SANITIZER, sanitizeHtml } from "@/app/_lib/html-sanitizer";
import { usePromptAPI } from "@/app/_hooks/usePromptAPI";

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

const INIT_CANVAS = `<article class="landing-canvas"><p class="eyebrow">Luke Cheng</p><h1>
Programmer by trade.<br/>
Chemist by training.<br/>
Driven by curiosity about how our worlds work.</h1><p>Use the navigation above to explore, or start a chat.</p></article>`;

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

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatPageContext = {
  path: string;
  title: string;
  summary: string;
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePortfolioAi() {
  const [canvas, setCanvas] = useState(INIT_CANVAS);
  const [question, setQuestion] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
    async (requestedQuestion: string, pageContext: ChatPageContext) => {
      const request = `The visitor started this chat from the ${pageContext.title} page (${pageContext.path}). That page is about: ${pageContext.summary}\n\nAnswer the visitor's question directly: "${requestedQuestion}" Use the portfolio source as your only evidence. Use the originating page only as context for the answer; do not claim it contains information it does not. Explain relevant connections, reasoning, or tradeoffs when the source supports them. Do not merely list experience. Present the answer as a thoughtful, focused portfolio canvas in semantic HTML. Return semantic HTML only.`;
      const assistantId = `assistant-${Date.now()}`;
      setMessages((current) => [
        ...current,
        { id: `user-${Date.now()}`, role: "user", content: requestedQuestion },
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        await promptStreaming(request, {
          onChunk: (_chunk, cumulative) => {
            const response = sanitizeCanvas(cumulative);
            setCanvas(response);
            setMessages((current) => current.map((message) =>
              message.id === assistantId ? { ...message, content: response } : message,
            ));
          },
        });
      } catch {
        // error state is managed by usePromptAPI
      }
    },
    [promptStreaming],
  );

  const handleQuestion = useCallback(
    (pageContext: ChatPageContext) => {
      const trimmed = question.trim();
      if (!trimmed) return;
      if (!isReady) return;
      setQuestion("");
      void generateAnswer(trimmed, pageContext);
    },
    [generateAnswer, isReady, question],
  );

  const handleSuggestionSelect = useCallback(
    (selected: string, pageContext: ChatPageContext) => {
      if (!isReady || isGenerating) return;
      setQuestion("");
      void generateAnswer(selected, pageContext);
    },
    [generateAnswer, isGenerating, isReady],
  );

  return {
    phase,
    canvas,
    messages,
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
