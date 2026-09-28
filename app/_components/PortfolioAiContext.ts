"use client";

import { createContext, useContext } from "react";
import type { usePortfolioAi } from "../_hooks/usePortfolioAi";

export type PortfolioAiState = ReturnType<typeof usePortfolioAi>;

export const PortfolioAiContext = createContext<PortfolioAiState | null>(null);

export function usePortfolioAiState() {
  const state = useContext(PortfolioAiContext);
  if (!state) throw new Error("PortfolioAiContext is missing its provider.");
  return state;
}
