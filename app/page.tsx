"use client";

import { useState, useEffect, useRef } from "react";
import WelcomeSection from "./components/WelcomeSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AppBar from "./components/AppBar";
import ScrollIndicator from "./components/ScrollIndicator";
import { ChatProvider } from "./contexts/ChatContext";

function HomeContent() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isAppBarSticky, setIsAppBarSticky] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const welcomeSectionRef = useRef<HTMLElement | null>(null);

  // Callback ref to set the welcome section element
  const setWelcomeSectionRef = (element: HTMLElement | null) => {
    welcomeSectionRef.current = element;
  };

  // Handle chat mode change from WelcomeSection
  const handleChatModeChange = (chatMode: boolean) => {
    setIsChatMode(chatMode);
  };

  useEffect(() => {
    // Intersection Observer for AppBar positioning
    const welcomeObserver = new IntersectionObserver(
      ([entry]) => {
        // When the welcome section is out of view, make AppBar sticky
        setIsAppBarSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    // Intersection Observer for scroll indicator - hide when welcome section is out of view
    const scrollIndicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setShowScrollIndicator(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Hide when 30% of welcome section is out of view
        rootMargin: "0px 0px 0px 0px",
      }
    );

    // Observe the welcome section
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
      <ChatProvider>
        <WelcomeSection 
          onRef={setWelcomeSectionRef} 
          onChatModeChange={handleChatModeChange}
        />
      </ChatProvider>
      {!isChatMode && showScrollIndicator && <ScrollIndicator />}
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
      <AppBar isSticky={isAppBarSticky} />
    </main>
  );
}

export default function Home() {
  return <HomeContent />;
}
