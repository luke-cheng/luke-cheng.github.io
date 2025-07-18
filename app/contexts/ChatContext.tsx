"use client";

import { createContext, use, useState, ReactNode } from "react";
import { Message } from "../types/chat";

interface ChatState {
  history: Message[];
  input: string;
  addMessage: (message: Message) => void;
  setInput: (input: string) => void;
  handleFirstMessage: () => void;
}

const ChatContext = createContext<ChatState | null>(null);

export function useChatContext(): ChatState {
  const context = use(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const addMessage = (message: Message) => {
    setHistory((prev) => [...prev, message]);
  };

  const handleFirstMessage = () => {
    // This can be used for any first message specific logic if needed
    // Chat mode is now determined by history.length > 0
  };

  const value: ChatState = {
    history,
    input,
    addMessage,
    setInput,
    handleFirstMessage,
  };

  return <ChatContext value={value}>{children}</ChatContext>;
} 