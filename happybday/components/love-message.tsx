"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { ChevronDown } from "lucide-react";

interface LoveMessageProps {
  onContinue: () => void;
  isVisible: boolean;
}

export function LoveMessage({ onContinue, isVisible }: LoveMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [showContent, setShowContent] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Custom heartfelt message - personalized for Farah from Bryce
  const paragraphs = [
    {
      text: "Dear Farah,",
      style: "text-3xl md:text-4xl text-primary mb-4",
    },
    {
      text: "From the moment we started talking, I knew there was something special about you. Your laugh, the way you see the world, everything about you captivates me.",
      style: "text-xl md:text-2xl text-foreground",
    },
    {
      text: "Every conversation with you feels like discovering a new constellation in the night sky. You make even the ordinary moments feel magical.",
      style: "text-lg md:text-xl text-muted-foreground",
    },
    {
      text: "You deserve all the happiness in the world, and I hope this birthday brings you everything your heart desires.",
      style: "text-lg md:text-xl text-muted-foreground",
    },
    {
      text: "You are extraordinary, Farah. Never forget that.",
      style: "text-2xl md:text-3xl text-primary font-medium",
    },
    {
      text: "- Bryce",
      style: "text-xl text-accent mt-6 italic",
    },
  ];

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    
    setTimeout(() => setShowContent(true), 100);
  }, [isVisible]);

  useEffect(() => {
    if (!showContent) return;

    // Animate heart SVG stroke
    animate(".love-heart-outline", {
      strokeDashoffset: [100, 0],
      opacity: [0, 1],
      duration: 1800,
      easing: "easeOutExpo",
    });

    // Animate decorative line
    animate(".message-line", {
      scaleX: [0, 1],
      opacity: [0, 1],
      duration: 1000,
      delay: 400,
      easing: "easeOutExpo",
    });

    // Reveal paragraphs one by one
    paragraphs.forEach((_, index) => {
      setTimeout(() => {
        setVisibleParagraphs(index + 1);
      }, 1000 + index * 700);
    });

    // Show continue button after all paragraphs
    setTimeout(() => {
      setShowButton(true);
    }, 1000 + paragraphs.length * 700 + 500);
  }, [showContent, paragraphs.length]);

  // Animate each paragraph as it becomes visible
  useEffect(() => {
    if (visibleParagraphs > 0) {
      const paragraphEl = document.querySelector(`.love-p-${visibleParagraphs - 1}`);
      if (paragraphEl) {
        animate(paragraphEl, {
          opacity: [0, 1],
          translateY: [30, 0],
          translateX: [-10, 0],
          duration: 900,
          easing: "easeOutExpo",
        });
      }
    }
  }, [visibleParagraphs]);

  // Animate button when shown
  useEffect(() => {
    if (showButton) {
      animate(".love-continue", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: "easeOutExpo",
      });
    }
  }, [showButton]);

  if (!showContent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center px-4 py-20"
    >
      {/* Parallax decorative elements */}
      <div
        className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full opacity-30"
        data-parallax-speed="0.05"
        style={{
          background: "radial-gradient(circle, #727594 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute right-[15%] bottom-[30%] h-48 w-48 rounded-full opacity-20"
        data-parallax-speed="0.03"
        style={{
          background: "radial-gradient(circle, #ff6b8a 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-3xl text-center">
        {/* Elegant heart outline - SVG animated */}
        <div className="mb-10 flex justify-center">
          <svg
            className="love-heart-outline w-20 h-20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff6b8a"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0 }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>

        {/* Decorative line */}
        <div
          className="message-line mx-auto mb-10 h-px w-32 origin-center"
          style={{ 
            background: "linear-gradient(90deg, transparent, #727594, transparent)",
            opacity: 0,
            transform: "scaleX(0)",
          }}
        />

        {/* Paragraphs with staggered reveal */}
        <div className="space-y-6">
          {paragraphs.map((para, index) => (
            <p
              key={index}
              className={`love-p-${index} font-serif leading-relaxed ${para.style}`}
              style={{ 
                opacity: 0,
                display: visibleParagraphs > index ? "block" : "none",
              }}
            >
              {para.text}
            </p>
          ))}
        </div>

        {showButton && (
          <button
            onClick={onContinue}
            className="love-continue group mt-16 flex cursor-pointer flex-col items-center gap-2 border-none bg-transparent mx-auto"
            style={{ opacity: 0 }}
          >
            <span className="font-sans text-sm uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-primary">
              I have something for you
            </span>
            <ChevronDown className="h-6 w-6 animate-bounce text-primary" />
          </button>
        )}
      </div>
    </div>
  );
}
