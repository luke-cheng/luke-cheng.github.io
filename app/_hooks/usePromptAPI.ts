import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types & Defaults ─────────────────────────────────────────────────────────

/** Raw error from the API, surfaced directly to the visitor. */
export type AiError = {
  name: string;
  message: string;
};

/** A complete description of the on-device AI setup phase. */
export type AiPhase =
  | { status: "checking" }
  | { status: "unavailable" }
  | { status: "downloadable"; progress: number }
  | { status: "downloading"; progress: number }
  | { status: "ready" }
  | { status: "error"; error: AiError };

export const DEFAULT_MODEL_OPTIONS: LanguageModelCreateCoreOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

export type PromptApiOptions = {
  systemPrompt?: string;
  initialPrompts?: NonNullable<LanguageModelCreateOptions["initialPrompts"]>;
  modelOptions?: LanguageModelCreateCoreOptions;
  autoInitialize?: boolean;
  autoReloadOnDownload?: boolean;
  onContextOverflow?: () => void;
};

export type StreamPromptOptions = {
  signal?: AbortSignal;
  onChunk?: (chunk: string, cumulative: string) => void;
};

export type StandardPromptOptions = {
  signal?: AbortSignal;
  responseConstraint?: Record<string, unknown>;
  omitResponseConstraintInput?: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function toAiError(error: unknown): AiError {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return { name: "Error", message: String(error) };
}

export function getPromptApiStatusLabel(
  phase: AiPhase,
  isGenerating: boolean,
  contextPercent = 0,
): string {
  switch (phase.status) {
    case "checking":
      return "Checking local model";
    case "downloadable":
    case "downloading": {
      const percentage =
        (phase.progress <= 1 ? phase.progress * 100 : phase.progress) | 0;
      return `Downloading local model (${percentage}%)`;
    }
    case "unavailable":
      return "Prompt API unavailable";
    case "error":
      return "Prompt API setup failed";
    case "ready":
      return isGenerating
        ? `Generating… (${contextPercent}%)`
        : `on-device AI ready (${contextPercent}%)`;
  }
}

// ─── Generic Hook ────────────────────────────────────────────────────────────

export function usePromptAPI(options: PromptApiOptions = {}) {
  const {
    systemPrompt,
    initialPrompts,
    modelOptions = DEFAULT_MODEL_OPTIONS,
    autoInitialize = true,
    autoReloadOnDownload = false,
    onContextOverflow,
  } = options;

  const [phase, setPhase] = useState<AiPhase>({ status: "checking" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<AiError | null>(null);
  const [contextStats, setContextStats] = useState<{
    usage: number;
    window: number;
  } | null>(null);

  const sessionRef = useRef<LanguageModel | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const generationIdRef = useRef(0);

  const isReady = phase.status === "ready";
  const contextPercent =
    contextStats && contextStats.window > 0
      ? ((contextStats.usage / contextStats.window) * 100) | 0
      : 0;

  const syncContextStats = useCallback((session: LanguageModel | null) => {
    if (!session) return;
    if (
      typeof session.contextUsage === "number" &&
      typeof session.contextWindow === "number"
    ) {
      setContextStats({
        usage: session.contextUsage,
        window: session.contextWindow,
      });
    }
  }, []);

  const createSession = useCallback(
    async (
      overridePrompts?: NonNullable<LanguageModelCreateOptions["initialPrompts"]>,
      triggerReloadOnDownload = false,
    ): Promise<LanguageModel | null> => {
      if (typeof LanguageModel === "undefined") {
        setPhase({ status: "unavailable" });
        return null;
      }

      // Cleanup prior session
      sessionRef.current?.destroy();
      sessionRef.current = null;

      const promptsToUse: NonNullable<LanguageModelCreateOptions["initialPrompts"]> | undefined =
        overridePrompts ??
        initialPrompts ??
        (systemPrompt
          ? [{ role: "system" as const, content: systemPrompt }]
          : undefined);

      try {
        const session = await LanguageModel.create({
          ...modelOptions,
          ...(promptsToUse && promptsToUse.length > 0 ? { initialPrompts: promptsToUse } : {}),
          monitor: (monitor) =>
            monitor.addEventListener("downloadprogress", (e) =>
              setPhase({ status: "downloading", progress: e.loaded }),
            ),
        });

        sessionRef.current = session;
        syncContextStats(session);

        session.addEventListener("contextoverflow", () => {
          syncContextStats(session);
          onContextOverflow?.();
        });

        setPhase({ status: "ready" });

        if (triggerReloadOnDownload && autoReloadOnDownload) {
          window.location.reload();
        }

        return session;
      } catch (err) {
        console.error(err);
        const aiErr = toAiError(err);
        setPhase({ status: "error", error: aiErr });
        setError(aiErr);
        return null;
      }
    },
    [
      autoReloadOnDownload,
      initialPrompts,
      modelOptions,
      onContextOverflow,
      syncContextStats,
      systemPrompt,
    ],
  );

  const init = useCallback(async () => {
    if (typeof LanguageModel === "undefined") {
      setPhase({ status: "unavailable" });
      return;
    }

    try {
      const status = await LanguageModel.availability(modelOptions);

      switch (status) {
        case "available":
          setPhase({ status: "checking" });
          await createSession();
          break;
        case "downloadable":
        case "downloading":
          setPhase({ status: "downloading", progress: 0 });
          await createSession(undefined, true);
          break;
        case "unavailable":
          // Attempt create() so Chrome surfaces the precise hardware/storage reason if any
          await createSession();
          break;
      }
    } catch (err) {
      console.error(err);
      const aiErr = toAiError(err);
      setPhase({ status: "error", error: aiErr });
      setError(aiErr);
    }
  }, [createSession, modelOptions]);

  useEffect(() => {
    let cancelled = false;

    if (autoInitialize) {
      const initialize = async () => {
        if (typeof LanguageModel === "undefined") {
          if (!cancelled) setPhase({ status: "unavailable" });
          return;
        }

        try {
          const status = await LanguageModel.availability(modelOptions);
          if (cancelled) return;

          switch (status) {
            case "available":
              setPhase({ status: "checking" });
              await createSession();
              break;
            case "downloadable":
            case "downloading":
              setPhase({ status: "downloading", progress: 0 });
              await createSession(undefined, true);
              break;
            case "unavailable":
              await createSession();
              break;
          }
        } catch (err) {
          if (cancelled) return;
          console.error(err);
          const aiErr = toAiError(err);
          setPhase({ status: "error", error: aiErr });
          setError(aiErr);
        }
      };

      void initialize();
    }

    return () => {
      cancelled = true;
      generationIdRef.current += 1;
      abortRef.current?.abort();
      sessionRef.current?.destroy();
      sessionRef.current = null;
    };
  }, [autoInitialize, createSession, modelOptions]);

  const promptStreaming = useCallback(
    async (
      input: LanguageModelPrompt,
      streamOptions: StreamPromptOptions = {},
    ): Promise<string> => {
      const session = sessionRef.current;
      if (!session) {
        throw new Error("Prompt API session is not initialized or ready.");
      }

      const generationId = ++generationIdRef.current;
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      const combinedSignal = streamOptions.signal
        ? AbortSignal.any([controller.signal, streamOptions.signal])
        : controller.signal;

      setIsGenerating(true);
      setError(null);

      let cumulative = "";

      try {
        const stream = session.promptStreaming(input, { signal: combinedSignal });
        const reader = stream.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (generationId !== generationIdRef.current) return cumulative;

            cumulative += value;
            streamOptions.onChunk?.(value, cumulative);
            syncContextStats(session);
          }
        } finally {
          reader.releaseLock();
        }

        syncContextStats(session);
        return cumulative;
      } catch (err) {
        if (
          generationId === generationIdRef.current &&
          (err as Error).name !== "AbortError"
        ) {
          console.error(err);
          const aiErr = toAiError(err);
          setError(aiErr);
          throw err;
        }
        return cumulative;
      } finally {
        if (generationId === generationIdRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [syncContextStats],
  );

  const prompt = useCallback(
    async (
      input: LanguageModelPrompt,
      promptOptions: StandardPromptOptions = {},
    ): Promise<string> => {
      const session = sessionRef.current;
      if (!session) {
        throw new Error("Prompt API session is not initialized or ready.");
      }

      const generationId = ++generationIdRef.current;
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      const combinedSignal = promptOptions.signal
        ? AbortSignal.any([controller.signal, promptOptions.signal])
        : controller.signal;

      setIsGenerating(true);
      setError(null);

      try {
        const result = await session.prompt(input, {
          signal: combinedSignal,
          responseConstraint: promptOptions.responseConstraint,
          omitResponseConstraintInput: promptOptions.omitResponseConstraintInput,
        });

        syncContextStats(session);
        return result;
      } catch (err) {
        if (
          generationId === generationIdRef.current &&
          (err as Error).name !== "AbortError"
        ) {
          console.error(err);
          const aiErr = toAiError(err);
          setError(aiErr);
          throw err;
        }
        throw err;
      } finally {
        if (generationId === generationIdRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [syncContextStats],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
  }, []);

  const reset = useCallback(() => {
    window.location.reload();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    phase,
    isReady,
    isGenerating,
    error,
    sessionRef,
    contextUsage: contextStats?.usage ?? 0,
    contextWindow: contextStats?.window ?? 0,
    contextPercent,
    statusLabel: getPromptApiStatusLabel(phase, isGenerating, contextPercent),
    init,
    createSession,
    prompt,
    promptStreaming,
    stop,
    reset,
    clearError,
  };
}

export const usePromptApi = usePromptAPI;
export default usePromptAPI;
