"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { animate } from "animejs";
import { StarField } from "@/components/star-field";
import { HeartParticles } from "@/components/heart-particles";
import { BirthdayHero } from "@/components/birthday-hero";
import { LoveMessage } from "@/components/love-message";
import { GiftReveal } from "@/components/gift-reveal";
import { TheQuestion } from "@/components/the-question";
import { PasswordGate } from "@/components/password-gate";
import { MusicPlayer } from "@/components/music-player";

export default function BirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Parallax effect on mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  // Apply parallax to elements with data-parallax-speed attribute
  const updateParallax = useCallback(() => {
    const elements = document.querySelectorAll("[data-parallax-speed]");
    elements.forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-parallax-speed") || "0");
      const x = mousePos.current.x * speed * 100;
      const y = mousePos.current.y * speed * 100;
      (el as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
    });
    rafId.current = requestAnimationFrame(updateParallax);
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isUnlocked, handleMouseMove, updateParallax]);

  // Section transition animations
  useEffect(() => {
    if (!isStarted) return;

    const sections = document.querySelectorAll(".birthday-section");
    sections.forEach((section, index) => {
      if (index === currentSection) {
        animate(section, {
          opacity: [0, 1],
          translateY: [60, 0],
          duration: 1200,
          easing: "easeOutExpo",
        });
      }
    });
  }, [currentSection, isStarted]);

  const handleStart = () => {
    // Button pulse animation
    animate(".start-btn-inner", {
      scale: [1, 1.1, 1],
      duration: 400,
      easing: "easeInOutSine",
    });

    // Ripple effect
    animate(".start-ripple", {
      scale: [1, 3],
      opacity: [0.5, 0],
      duration: 800,
      easing: "easeOutExpo",
    });

    // Overlay fade
    setTimeout(() => {
      animate(".start-overlay", {
        opacity: [1, 0],
        duration: 1000,
        easing: "easeOutExpo",
        complete: () => {
          const overlay = document.querySelector(".start-overlay") as HTMLElement;
          if (overlay) overlay.style.display = "none";
          setIsStarted(true);
        },
      });
    }, 400);
  };

  const goToNext = () => {
    const currentEl = document.querySelector(
      `.birthday-section[data-index="${currentSection}"]`
    );
    if (currentEl) {
      // Current section fades up and out
      animate(currentEl, {
        opacity: [1, 0],
        translateY: [0, -80],
        scale: [1, 0.95],
        duration: 800,
        easing: "easeInExpo",
        complete: () => {
          setCurrentSection((prev) => Math.min(prev + 1, 3));
        },
      });

      // Add particle burst effect
      const container = containerRef.current;
      if (container) {
        for (let i = 0; i < 15; i++) {
          const particle = document.createElement("div");
          particle.className = "absolute rounded-full pointer-events-none";
          particle.style.cssText = `
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            left: 50%;
            top: 40%;
            background: #727594;
            opacity: 0;
          `;
          container.appendChild(particle);

          animate(particle, {
            translateX: [0, (Math.random() - 0.5) * 300],
            translateY: [0, (Math.random() - 0.5) * 200 - 100],
            opacity: [0.8, 0],
            scale: [1, 0],
            duration: 1000,
            delay: i * 30,
            easing: "easeOutExpo",
            complete: () => particle.remove(),
          });
        }
      }
    }
  };

  // Show password gate if not unlocked
  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Animated Star Background */}
      <StarField />

      {/* Floating Hearts */}
      <HeartParticles />

      {/* Music Player */}
      <MusicPlayer />

      {/* Start Overlay */}
      <div className="start-overlay fixed inset-0 z-50 flex items-center justify-center bg-background">
        <button
          onClick={handleStart}
          className="group relative cursor-pointer border-none bg-transparent"
        >
          {/* Ripple effect container */}
          <div className="start-ripple absolute inset-0 rounded-full border-2 border-primary/50 opacity-0" />

          <div className="start-btn-inner glow-box rounded-full border-2 border-primary/50 px-14 py-7 transition-all duration-500 group-hover:border-primary group-hover:bg-primary/10">
            <span className="glow-text font-serif text-2xl font-light tracking-widest text-primary md:text-3xl">
              Click to Begin
            </span>
          </div>

          {/* Animated rings */}
          <div className="absolute inset-0 -m-4 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 -m-8 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Section 0: Birthday Hero */}
        <div
          className="birthday-section min-h-screen"
          data-index="0"
          style={{ display: currentSection === 0 ? "block" : "none" }}
        >
          <BirthdayHero
            onContinue={goToNext}
            isVisible={isStarted && currentSection === 0}
          />
        </div>

        {/* Section 1: Love Message */}
        <div
          className="birthday-section min-h-screen"
          data-index="1"
          style={{ display: currentSection === 1 ? "block" : "none" }}
        >
          <LoveMessage onContinue={goToNext} isVisible={currentSection === 1} />
        </div>

        {/* Section 2: Gift Reveal */}
        <div
          className="birthday-section min-h-screen"
          data-index="2"
          style={{ display: currentSection === 2 ? "block" : "none" }}
        >
          <GiftReveal onContinue={goToNext} isVisible={currentSection === 2} />
        </div>

        {/* Section 3: The Question */}
        <div
          className="birthday-section min-h-screen"
          data-index="3"
          style={{ display: currentSection === 3 ? "block" : "none" }}
        >
          <TheQuestion isVisible={currentSection === 3} />
        </div>
      </div>
    </main>
  );
}
