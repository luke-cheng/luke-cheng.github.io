"use client";

import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import { Message } from "../types/chat";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatSectionProps {
  onFirstMessage: () => void;
  messages?: Message[];
  onSendMessage?: (message: Message) => void;
  input?: string;
  onInputChange?: (value: string) => void;
}

export default function ChatSection({
  onFirstMessage,
  messages = [],
  onSendMessage,
  input = "",
  onInputChange,
}: ChatSectionProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Handle first message sent - trigger once when messages length changes from 0 to 1
  useEffect(() => {
    if (messages.length === 1) {
      onFirstMessage();
    }
  }, [messages.length, onFirstMessage]);

  // Determine if we should show chat history (after first message)
  const shouldShowChatHistory = messages.length > 0;

  const handleSendMessage = (message: Message) => {
    // Just pass the message to parent, no local state management
    onSendMessage?.(message);
    
    // Show loading placeholder for AI messages
    if (message.role === "user") {
      setShowPlaceholder(true);
    } else {
      setShowPlaceholder(false);
    }
  };

  // Get only the latest AI message to display
  const latestAiMessage = messages
    .filter((msg) => msg.role === "assistant")
    .pop();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 transition-all duration-700 ease-in-out">
      {/* Chat Input */}
      <ChatInput
        variant="full"
        messages={messages}
        onSend={handleSendMessage}
        onFirstMessage={onFirstMessage}
        input={input}
        onInputChange={onInputChange}
      />

      {/* Chat Messages */}
      <div
        className="overflow-y-auto fade-in-up transition-all duration-700 ease-in-out"
        style={{
          opacity: shouldShowChatHistory ? 1 : 0,
        }}
      >
        {/* Show only the latest AI message */}
        {latestAiMessage && (
          <div className="mb-4 flex justify-start">
            <div className="text-gray-300 text-lg leading-relaxed max-w-2xl prose prose-invert prose-gray">
              <Markdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-bold text-white mb-2">{children}</h3>,
                  p: ({children}) => <p className="mb-3">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="ml-4">{children}</li>,
                  code: ({children}) => <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm">{children}</code>,
                  pre: ({children}) => <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-3">{children}</pre>,
                  blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-3">{children}</blockquote>,
                  a: ({children, href}) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                  strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                }}
              >
                {latestAiMessage.content}
              </Markdown>
            </div>
          </div>
        )}
        
        {/* Loading Placeholder */}
        {showPlaceholder && (
          <div className="mb-4 flex justify-start">
            <div className="text-gray-400 text-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
