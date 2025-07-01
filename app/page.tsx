"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import WelcomeSection from "./components/WelcomeSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AppBar from "./components/AppBar";
import { Message } from "./types/chat";

export default function Home() {
  const [isAppBarSticky, setIsAppBarSticky] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const welcomeSectionRef = useRef<HTMLElement | null>(null);

  // Callback ref to set the welcome section element
  const setWelcomeSectionRef = useCallback((element: HTMLElement | null) => {
    welcomeSectionRef.current = element;
  }, []);

  // Handle chat send from AppBar - scroll to top and expand to full chat
  const handleChatSend = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsChatMode(true);
  }, []);

  // Handle message sending from any chat input
  const handleSendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  // Handle first message
  const handleFirstMessage = useCallback(() => {
    setIsChatMode(true);
  }, []);

  useEffect(() => {
    // Intersection Observer for AppBar positioning - monitor welcome section instead of AppBar
    const welcomeObserver = new IntersectionObserver(
      ([entry]) => {
        // When the welcome section is out of view, make AppBar sticky
        setIsAppBarSticky(!entry.isIntersecting);

        // When welcome section is completely out of view, enter chat mode permanently
        if (!entry.isIntersecting) {
          setIsChatMode(true);
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    // Intersection Observer for scroll indicator
    const scrollIndicatorObserver = new IntersectionObserver(
      ([entry]) => {
        // Hide scroll indicator when welcome section is mostly out of view
        setShowScrollIndicator(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Hide when 30% of welcome section is out of view
        rootMargin: "0px 0px 0px 0px",
      }
    );

    // Observe the welcome section for AppBar positioning and chat mode
    if (welcomeSectionRef.current) {
      welcomeObserver.observe(welcomeSectionRef.current);
      scrollIndicatorObserver.observe(welcomeSectionRef.current);
    }

    return () => {
      welcomeObserver.disconnect();
      scrollIndicatorObserver.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen snap-y snap-mandatory overflow-y-scroll">
      <WelcomeSection
        onRef={setWelcomeSectionRef}
        showScrollIndicator={showScrollIndicator}
        isChatMode={isChatMode}
        onFirstMessage={handleFirstMessage}
        messages={messages}
        onSendMessage={handleSendMessage}
        input={input}
        onInputChange={handleInputChange}
      />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />

    
      <AppBar
        isSticky={isAppBarSticky}
        onChatSend={handleChatSend}
        messages={messages}
        onSendMessage={handleSendMessage}
        onFirstMessage={handleFirstMessage}
        input={input}
        onInputChange={handleInputChange}
      />
    </main>
  );
}
