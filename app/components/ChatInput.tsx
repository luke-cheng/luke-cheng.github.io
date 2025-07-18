"use client";

import { useState, useEffect } from "react";
import { ApiClient } from "../utils/apiClient";
import { ChatRequest } from "../types/api";
import { Message } from "../types/chat";
import { handleError } from "../utils/errorHandler";
import { Send } from "@geist-ui/icons";

interface ChatInputProps {
  messages?: Message[];
  onSend?: (message: Message) => void;
  onFirstMessage?: () => void;
  input?: string;
  onInputChange?: (value: string) => void;
}

export default function ChatInput({
  messages = [],
  onSend,
  onFirstMessage,
  input = "",
  onInputChange,
}: ChatInputProps) {
  const [localInput, setLocalInput] = useState(input);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with parent input
  useEffect(() => {
    setLocalInput(input);
  }, [input]);

  // Get the latest user message for placeholder
  const latestUserMessage =
    messages.filter((msg) => msg.role === "user").pop()?.content || "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalInput(value);
    onInputChange?.(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: localInput.trim(),
      timestamp: new Date(),
    };

    // Trigger first message callback if this is the first message
    if (messages.length === 0) {
      onFirstMessage?.();
    }

    setLocalInput("");
    onInputChange?.(""); // Clear parent input state
    setIsLoading(true);

    try {
      // Prepare chat history for API
      const history = messages.map((msg) => ({
        text: msg.content,
        isUser: msg.role === "user",
      }));

      const request = {
        message: userMessage.content,
        history,
      };

      // Send user message first
      onSend?.(userMessage);

      // Create AI message placeholder
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      // Add AI message placeholder
      onSend?.(aiMessage);

      // Make API call with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw { response, error: new Error(`HTTP ${response.status}`) };
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      let fullText = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                // Update the AI message content by replacing the last message
                const updatedAiMessage: Message = {
                  ...aiMessage,
                  content: fullText,
                };
                // Replace the last message instead of adding a new one
                onSend?.(updatedAiMessage);
              }
              if (data.done) {
                break;
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);

      // Use the error handler to get a proper error message
      const errorMessageText = handleError(error);

      // Add error message as AI response
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: errorMessageText,
        timestamp: new Date(),
      };

      // Don't send user message again, just send the error message
      setTimeout(() => {
        onSend?.(errorMessage);
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 transition-all duration-700 ease-in-out mb-6"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={localInput}
          onChange={handleInputChange}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
          disabled={isLoading}
          autoFocus
          autoComplete="off"
          style={{ color: localInput ? "white" : "transparent" }}
        />
        {!localInput && (
          <div className="absolute inset-0 pointer-events-none flex items-center px-4 py-3 text-gray-400">
            {messages.length === 0 ? (
              <>
                Ask about&nbsp;
                <span className="text-red-500">
                  <span className="line-through">
                    <span className="text-gray-400">Luke</span>
                  </span>
                  &nbsp;me
                </span>
                , the website, or anything else!
              </>
            ) : (
              latestUserMessage
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
