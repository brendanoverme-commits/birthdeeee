"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { Sparkles } from "lucide-react";

interface TheQuestionProps {
  isVisible: boolean;
}

export function TheQuestion({ isVisible }: TheQuestionProps) {
  const [answered, setAnswered] = useState<"yes" | "no" | null>(null);
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const hasAnimated = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const noMessages = [
    "Are you sure?",
    "Really?",
    "Think again...",
    "Please?",
    "Pretty please?",
    "I won't give up!",
    "Click Yes!",
  ];

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    setTimeout(() => setShowContent(true), 100);
  }, [isVisible]);

  useEffect(() => {
    if (!showContent) return;

    // Animated SVG heart drawing
    animate(".question-heart-path", {
      strokeDashoffset: [200, 0],
      duration: 2000,
      easing: "easeInOutSine",
    });

    // Fill in after drawing
    setTimeout(() => {
      animate(".question-heart-path", {
        fill: ["rgba(255,107,138,0)", "rgba(255,107,138,1)"],
        duration: 800,
        easing: "easeOutExpo",
      });
    }, 1800);

    // Heart pulse
    setTimeout(() => {
      animate(".question-heart-container", {
        scale: [1, 1.1, 1],
        duration: 600,
        easing: "easeInOutSine",
      });
    }, 2400);

    // Question text reveal
    animate(".question-text", {
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1200,
      delay: 1500,
      easing: "easeOutExpo",
    });

    // The big question with special effect
    animate(".the-question", {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 1000,
      delay: 2500,
      easing: "easeOutElastic(1, 0.6)",
    });

    // Buttons slide in
    animate(".question-buttons", {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      delay: 3200,
      easing: "easeOutExpo",
    });

  }, [showContent]);

  const handleYes = () => {
    setAnswered("yes");

    // Epic celebration animation
    const container = document.querySelector(".celebration-container");
    if (!container) return;

    // Create multiple waves of hearts
    const createHeartExplosion = (delay: number, count: number) => {
      setTimeout(() => {
        for (let i = 0; i < count; i++) {
          const heart = document.createElement("div");
          const size = Math.random() * 35 + 15;
          const isFilled = Math.random() > 0.3;

          heart.innerHTML = `<svg viewBox="0 0 24 24" fill="${isFilled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
          heart.className = "absolute pointer-events-none";
          heart.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            color: ${Math.random() > 0.5 ? "#ff6b8a" : "#727594"};
          `;
          container.appendChild(heart);

          const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
          const distance = Math.random() * 350 + 150;

          animate(heart, {
            translateX: [0, Math.cos(angle) * distance],
            translateY: [0, Math.sin(angle) * distance - 100],
            scale: [0, 1.5, 0.8],
            rotate: [0, Math.random() * 540 - 270],
            opacity: [1, 1, 0],
            duration: 2500,
            easing: "easeOutExpo",
            complete: () => heart.remove(),
          });
        }
      }, delay);
    };

    createHeartExplosion(0, 30);
    createHeartExplosion(200, 20);
    createHeartExplosion(400, 25);

    // Create rising hearts from bottom
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        const size = Math.random() * 25 + 10;
        heart.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
        heart.className = "absolute pointer-events-none";
        heart.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          bottom: -50px;
          color: ${Math.random() > 0.5 ? "#ff6b8a" : "#727594"};
          opacity: ${Math.random() * 0.5 + 0.3};
        `;
        container.appendChild(heart);

        animate(heart, {
          translateY: [0, -window.innerHeight - 100],
          translateX: [0, Math.random() * 100 - 50],
          rotate: [0, Math.random() * 360 - 180],
          duration: 4000 + Math.random() * 2000,
          easing: "linear",
          complete: () => heart.remove(),
        });
      }, i * 150);
    }

    // Show response
    setTimeout(() => {
      animate(".yes-response", {
        scale: [0, 1.1, 1],
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutElastic(1, 0.5)",
      });

      // Continuous subtle heart pulse in response
      animate(".response-heart", {
        scale: [1, 1.15, 1],
        duration: 1500,
        loop: true,
        easing: "easeInOutSine",
      });
    }, 800);
  };

  const handleNoHover = () => {
    const maxX = 250;
    const maxY = 200;
    setNoAttempts((prev) => prev + 1);
    setNoButtonOffset({
      x: Math.random() * maxX * 2 - maxX,
      y: Math.random() * maxY * 2 - maxY,
    });

    // Shake the "no" button text
    animate(".no-btn-text", {
      rotate: [-5, 5, -3, 3, 0],
      duration: 300,
      easing: "easeInOutSine",
    });
  };

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
      <div className="celebration-container pointer-events-none fixed inset-0 z-50 overflow-hidden" />

      {/* Parallax decorative elements */}
      <div
        className="absolute left-[20%] top-[20%] h-48 w-48 rounded-full opacity-20"
        data-parallax-speed="0.03"
        style={{
          background: "radial-gradient(circle, #ff6b8a 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute right-[20%] bottom-[25%] h-40 w-40 rounded-full opacity-15"
        data-parallax-speed="0.05"
        style={{
          background: "radial-gradient(circle, #727594 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-2xl text-center">
        {/* Animated SVG Heart */}
        <div className="question-heart-container mb-10 flex justify-center">
          <svg
            className="w-24 h-24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff6b8a"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="question-heart-path"
              style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </div>

        {!answered ? (
          <>
            <div className="question-text" style={{ opacity: 0 }}>
              <h2 className="glow-text mb-4 font-serif text-3xl font-light text-foreground md:text-4xl">
                One More Thing, Farah...
              </h2>
              <p className="mx-auto max-w-xl font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
                I&apos;ve been wanting to ask you this for a while now...
              </p>
            </div>

            <p className="the-question glow-text mt-10 font-serif text-3xl font-medium text-primary md:text-4xl lg:text-5xl" style={{ opacity: 0 }}>
              Will you be my girlfriend?
            </p>

            <div className="question-buttons mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row" style={{ opacity: 0 }}>
              <button
                onClick={handleYes}
                className="glow-box group cursor-pointer rounded-full border-2 px-14 py-5 transition-all duration-300 hover:scale-105"
                style={{ borderColor: "#ff6b8a", background: "rgba(255,107,138,0.2)" }}
              >
                <span className="font-serif text-2xl font-medium text-foreground transition-colors group-hover:text-white">
                  Yes!
                </span>
              </button>

              <div className="relative">
                <button
                  onMouseEnter={handleNoHover}
                  onTouchStart={handleNoHover}
                  style={{
                    transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
                    transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  className="no-btn cursor-pointer rounded-full border-2 border-muted-foreground/30 bg-transparent px-14 py-5 transition-colors hover:border-muted-foreground"
                >
                  <span className="no-btn-text inline-block font-serif text-2xl font-light text-muted-foreground">
                    {noAttempts > 0 ? noMessages[Math.min(noAttempts - 1, noMessages.length - 1)] : "No"}
                  </span>
                </button>
              </div>
            </div>

            {noAttempts > 0 && (
              <p className="mt-6 font-serif text-sm text-muted-foreground/60 animate-pulse">
                The button seems to be running away...
              </p>
            )}
          </>
        ) : (
          <div className="yes-response" style={{ opacity: 0 }}>
            <div className="response-heart mb-8 flex justify-center">
              <svg
                className="w-24 h-24"
                viewBox="0 0 24 24"
                fill="#ff6b8a"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <h2 className="glow-text mb-6 font-serif text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
              You just made me the happiest person alive!
            </h2>

            <div className="mt-10 flex items-center justify-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <p className="font-serif text-2xl text-primary">
                I can&apos;t wait to create more memories with you
              </p>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>

            <p className="mx-auto mt-10 max-w-lg font-serif text-lg text-muted-foreground leading-relaxed">
              Thank you for being you, Farah. Thank you for existing.
              And thank you for giving me a chance.
              I promise to make you smile every single day.
            </p>

            <div className="mt-12 flex items-center justify-center gap-3">
              <span className="font-serif text-xl text-foreground">
                Happy Birthday, my love
              </span>
            </div>

            <p className="mt-6 font-serif text-lg text-primary/80">
              - Bryce
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
