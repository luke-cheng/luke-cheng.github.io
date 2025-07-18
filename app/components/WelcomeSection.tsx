"use client";

import { useEffect } from "react";
import ChatSection from "./ChatSection";
import { useChatContext } from "../contexts/ChatContext";

interface WelcomeSectionProps {
  onRef: (element: HTMLElement | null) => void;
  onChatModeChange: (chatMode: boolean) => void;
}

export default function WelcomeSection({ onRef, onChatModeChange }: WelcomeSectionProps) {
  const { history } = useChatContext();
  const isChatMode = history.length > 0;

  // Notify parent when chat mode changes
  useEffect(() => {
    onChatModeChange(isChatMode);
  }, [isChatMode, onChatModeChange]);

  return (
    <section
      ref={onRef}
      className={`min-h-screen flex flex-col justify-center items-center px-4 relative transition-all duration-700 ease-in-out`}
    >
      {/* Welcome Text */}
      <div
        className={`text-center mb-8 transition-all duration-700 ease-in-out ${
          isChatMode
            ? "opacity-0 transform -translate-y-8 pointer-events-none absolute"
            : "opacity-100"
        }`}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          Hi, I'm Luke
          <span className="text-red-500 text-3xl">'s AI</span>
        </h1>
        <p className="text-3xl md:text-5xl text-gray-300">
          Welcome to <span className="text-red-500">my</span> website!
        </p>
      </div>

      {/* Chat Section Container */}
      <div
        className={`w-full flex justify-center transition-all duration-700 ease-in-out ${
          isChatMode ? "pt-32 pb-12" : "pt-8 pb-8"
        }`}
      >
        <ChatSection />
      </div>
    </section>
  );
}
