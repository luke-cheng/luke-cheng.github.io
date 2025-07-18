"use client";

import { useState, useEffect } from "react";
import ChatInput from "./ChatInput";
import { useChatContext } from "../contexts/ChatContext";

export default function ChatSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { history, input, setInput, addMessage, handleFirstMessage } = useChatContext();
  
  const isChatMode = history.length > 0;

  useEffect(() => {
    // Expand after a short delay for smooth animation
    const timer = setTimeout(() => setIsExpanded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get the latest AI message to display under the input
  const latestAiMessage = history
    .filter((msg) => msg.role === "assistant")
    .pop();

  return (
    <div className={`w-full max-w-4xl mx-auto transition-all duration-700 ease-in-out ${
      isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
    }`}>
      
      {/* Chat Input */}
      <ChatInput 
        messages={history}
        onSend={addMessage}
        onFirstMessage={handleFirstMessage}
        input={input}
        onInputChange={setInput}
      />

      {/* Latest AI Response - shown under the input like "an answer from the void" */}
      {latestAiMessage && (
        <div className="mt-4 flex justify-start">
          <div className="max-w-2xl text-gray-300 text-lg leading-relaxed">
            {latestAiMessage.content}
          </div>
        </div>
      )}
    </div>
  );
}
