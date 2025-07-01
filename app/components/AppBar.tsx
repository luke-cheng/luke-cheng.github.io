"use client";

import ChatInput from "./ChatInput";
import { Message } from "../types/chat";

interface AppBarProps {
  isSticky: boolean;
  onChatSend?: () => void;
  messages?: Message[];
  onSendMessage?: (message: Message) => void;
  onFirstMessage?: () => void;
  input?: string;
  onInputChange?: (value: string) => void;
}

export default function AppBar({ isSticky, onChatSend, messages = [], onSendMessage, onFirstMessage, input = "", onInputChange }: AppBarProps) {
  return (
    <header
      className={`transition-all duration-300 ${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
          : "absolute bottom-0 left-0 right-0 z-50 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Luke Cheng</h1>
          </div>

          {/* Chat Input - only show when sticky */}
          {isSticky && (
            <ChatInput 
              variant="minimal" 
              messages={messages}
              onSend={onSendMessage}
              onFirstMessage={onFirstMessage}
              input={input}
              onInputChange={onInputChange}
            />
          )}

          <nav className="hidden md:flex space-x-8">
            <a
              href="#about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#experience"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
