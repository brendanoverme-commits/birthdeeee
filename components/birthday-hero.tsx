"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { ChevronDown } from "lucide-react";

interface BirthdayHeroProps {
  onContinue: () => void;
  isVisible: boolean;
}

export function BirthdayHero({ onContinue, isVisible }: BirthdayHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasAnimated = useRef(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    
    // Small delay then show content and animate
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    if (!showContent) return;

    // Animate decorative orbs
    animate(".hero-orb", {
      scale: [0, 1],
      opacity: [0, 0.8],
      duration: 1500,
      delay: stagger(200),
      easing: "easeOutElastic(1, 0.5)",
    });

    // Animate title letters with 3D effect
    if (titleRef.current) {
      const text = "Happy Birthday";
      titleRef.current.innerHTML = text
        .split("")
        .map((char, i) =>
          char === " "
            ? '<span class="inline-block">&nbsp;</span>'
            : `<span class="title-letter inline-block" style="opacity: 0; transform: translateY(80px) rotateX(-90deg); transform-style: preserve-3d">${char}</span>`
        )
        .join("");

      animate(".title-letter", {
        opacity: [0, 1],
        translateY: [80, 0],
        rotateX: [-90, 0],
        duration: 1200,
        delay: stagger(50, { start: 300 }),
        easing: "easeOutExpo",
      });
    }

    // Animate name after title
    if (nameRef.current) {
      const name = "Farah";
      nameRef.current.innerHTML = name
        .split("")
        .map((char) => `<span class="name-letter inline-block" style="opacity: 0">${char}</span>`)
        .join("");

      animate(".name-letter", {
        opacity: [0, 1],
        scale: [0, 1.3, 1],
        translateY: [30, -5, 0],
        duration: 900,
        delay: stagger(80, { start: 1600 }),
        easing: "easeOutElastic(1, 0.6)",
      });

      // Add glow pulse to name container
      animate(nameRef.current, {
        textShadow: [
          "0 0 0px rgba(114, 117, 148, 0)",
          "0 0 40px rgba(114, 117, 148, 0.9)",
          "0 0 15px rgba(114, 117, 148, 0.5)",
        ],
        duration: 2500,
        delay: 2200,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
      });
    }

    // Animate subtitle
    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        delay: 2400,
        easing: "easeOutExpo",
      });
    }

    // Animate button
    if (buttonRef.current) {
      animate(buttonRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 3000,
        easing: "easeOutExpo",
      });
    }
  }, [showContent]);

  if (!showContent && isVisible) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
    >
      {/* Floating decorative orbs with parallax */}
      <div
        className="hero-orb absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full"
        data-parallax-speed="0.02"
        style={{
          background: "radial-gradient(circle, rgba(114, 117, 148, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          opacity: 0,
        }}
      />
      <div
        className="hero-orb absolute left-[20%] top-[30%] h-40 w-40 rounded-full"
        data-parallax-speed="0.04"
        style={{
          background: "radial-gradient(circle, rgba(139, 142, 176, 0.25) 0%, transparent 70%)",
          filter: "blur(30px)",
          opacity: 0,
        }}
      />
      <div
        className="hero-orb absolute right-[20%] top-[40%] h-56 w-56 rounded-full"
        data-parallax-speed="0.03"
        style={{
          background: "radial-gradient(circle, rgba(255, 107, 138, 0.15) 0%, transparent 70%)",
          filter: "blur(35px)",
          opacity: 0,
        }}
      />

      <div className="relative z-10 max-w-5xl">
        <h1
          ref={titleRef}
          className="glow-text mb-8 font-serif text-5xl font-light tracking-wider text-foreground md:text-7xl lg:text-8xl"
          style={{ perspective: "1000px" }}
        >
          Happy Birthday
        </h1>

        {/* Name with special styling */}
        <div className="mb-12">
          <span
            ref={nameRef}
            className="font-serif text-4xl font-medium tracking-[0.2em] text-primary md:text-6xl lg:text-7xl"
          >
            Farah
          </span>
        </div>

        <p
          ref={subtitleRef}
          className="mx-auto max-w-2xl font-serif text-xl font-light leading-relaxed text-muted-foreground md:text-2xl"
          style={{ opacity: 0 }}
        >
          Today marks another year of your beautiful existence...
          <br />
          <span className="mt-3 inline-block text-primary/90">and I have something special for you</span>
        </p>

        <button
          ref={buttonRef}
          onClick={onContinue}
          className="group mt-16 flex cursor-pointer flex-col items-center gap-3 border-none bg-transparent mx-auto"
          style={{ opacity: 0 }}
        >
          <span className="font-sans text-sm uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-primary">
            Continue
          </span>
          <div className="relative">
            <ChevronDown className="h-8 w-8 text-primary transition-transform group-hover:translate-y-1" />
            <ChevronDown className="absolute top-0 left-0 h-8 w-8 text-primary/30 animate-ping" />
          </div>
        </button>
      </div>
    </div>
  );
}
