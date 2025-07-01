"use client";

import ChatSection from "./ChatSection";
import { Message } from "../types/chat";

interface WelcomeSectionProps {
  showScrollIndicator: boolean;
  isChatMode: boolean;
  onFirstMessage: () => void;
  onRef: (element: HTMLElement | null) => void;
  messages?: Message[];
  onSendMessage?: (message: Message) => void;
  input?: string;
  onInputChange?: (value: string) => void;
}

export default function WelcomeSection({
  showScrollIndicator,
  isChatMode,
  onFirstMessage,
  onRef,
  messages = [],
  onSendMessage,
  input = "",
  onInputChange,
}: WelcomeSectionProps) {
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
        <ChatSection
          onFirstMessage={onFirstMessage}
          messages={messages}
          onSendMessage={onSendMessage}
          input={input}
          onInputChange={onInputChange}
        />
      </div>

      {/* Scroll Indicator - only show in welcome mode and when not scrolled */}
      {!isChatMode && showScrollIndicator && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce transition-all duration-700 ease-in-out">
          <div className="text-gray-400 text-center">
            <div className="text-sm mb-2">Scroll down</div>
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
