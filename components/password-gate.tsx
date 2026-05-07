"use client";

import { useState, useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

interface PasswordGateProps {
  onUnlock: () => void;
}

const CORRECT_PASSWORD = "iloveyou";

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lockRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const tl = createTimeline({ autoplay: true });

    // Animate lock with drawing effect
    tl.add(".lock-body", {
      strokeDashoffset: [200, 0],
      duration: 1500,
      ease: "inOutSine",
    }, 0);

    tl.add(".lock-shackle", {
      strokeDashoffset: [100, 0],
      duration: 1000,
      ease: "inOutSine",
    }, 500);

    // Lock glow pulse
    tl.add(".lock-glow", {
      opacity: [0, 0.6],
      scale: [0.8, 1],
      duration: 1000,
      ease: "outExpo",
    }, 1200);

    // Title reveal with letters
    if (titleRef.current) {
      const text = titleRef.current.textContent || "";
      titleRef.current.innerHTML = text
        .split("")
        .map((char) =>
          char === " "
            ? '<span class="inline-block">&nbsp;</span>'
            : `<span class="title-char inline-block opacity-0">${char}</span>`
        )
        .join("");

      tl.add(".title-char", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: stagger(40),
        ease: "outExpo",
      }, 1000);
    }

    // Subtitle fade
    tl.add(".gate-subtitle", {
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 800,
      ease: "outExpo",
    }, 1800);

    // Form elements
    tl.add(".gate-input", {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      ease: "outExpo",
    }, 2000);

    tl.add(".gate-button", {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 600,
      ease: "outExpo",
    }, 2300);

    tl.add(".gate-footer", {
      opacity: [0, 0.5],
      duration: 800,
      ease: "outExpo",
    }, 2600);

    // Create ambient floating particles
    const container = containerRef.current;
    if (container) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "gate-particle absolute rounded-full pointer-events-none";
        particle.style.cssText = `
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          background: var(--primary);
          opacity: 0;
        `;
        container.appendChild(particle);
      }

      animate(".gate-particle", {
        opacity: [0, 0.4, 0],
        translateY: [0, -50],
        duration: 4000,
        delay: stagger(200, { from: "random" }),
        loop: true,
        ease: "inOutSine",
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      // Success animation sequence
      const tl = createTimeline({ autoplay: true });

      // Lock opens
      tl.add(".lock-shackle", {
        translateY: [0, -8],
        rotate: [0, -15],
        duration: 400,
        ease: "outExpo",
      }, 0);

      // Everything fades and scales
      tl.add(containerRef.current, {
        opacity: [1, 0],
        scale: [1, 1.05],
        filter: ["blur(0px)", "blur(10px)"],
        duration: 800,
        ease: "inExpo",
        complete: () => onUnlock(),
      }, 300);
    } else {
      // Error animation
      setError(true);

      // Shake input
      animate(inputRef.current, {
        translateX: [-12, 12, -12, 12, -8, 8, -4, 4, 0],
        duration: 600,
        ease: "inOutSine",
      });

      // Lock shake
      animate(lockRef.current, {
        rotate: [-5, 5, -5, 5, -3, 3, 0],
        duration: 500,
        ease: "inOutSine",
      });

      // Flash red
      animate(".lock-body, .lock-shackle", {
        stroke: ["#727594", "#ff6b8a", "#727594"],
        duration: 800,
        ease: "inOutSine",
      });

      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(114, 117, 148, 0.1) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-md w-full">
        {/* Animated Lock SVG */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <svg
              ref={lockRef}
              className="w-20 h-20 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Lock body */}
              <rect
                className="lock-body"
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
              />
              {/* Lock shackle */}
              <path
                className="lock-shackle"
                d="M7 11V7a5 5 0 0 1 10 0v4"
                style={{ strokeDasharray: 100, strokeDashoffset: 100, transformOrigin: "17px 7px" }}
              />
            </svg>
            <div
              className="lock-glow absolute inset-0 w-20 h-20 rounded-full opacity-0"
              style={{
                background: "radial-gradient(circle, rgba(114, 117, 148, 0.4) 0%, transparent 70%)",
                filter: "blur(15px)",
              }}
            />
          </div>
        </div>

        <h1
          ref={titleRef}
          className="text-3xl md:text-4xl font-light text-foreground mb-4 tracking-wide"
        >
          A Surprise Awaits You
        </h1>

        <p className="gate-subtitle text-muted-foreground mb-10 text-lg font-light opacity-0">
          Enter the secret password, Farah...
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="gate-input relative opacity-0">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type the magic word"
              className={`w-full px-6 py-4 bg-secondary/50 border-2 rounded-xl text-center text-lg tracking-widest placeholder:tracking-normal placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300 ${
                error
                  ? "border-[#ff6b8a] ring-2 ring-[#ff6b8a]/20"
                  : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-7 left-0 right-0 text-[#ff6b8a] text-sm">
                That&apos;s not it... try again
              </p>
            )}
          </div>

          <button
            type="submit"
            className="gate-button w-full mt-4 px-8 py-4 bg-primary/20 hover:bg-primary/30 border-2 border-primary/30 hover:border-primary rounded-xl text-foreground font-medium tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] glow-box cursor-pointer opacity-0"
          >
            Unlock
          </button>
        </form>

        <p className="gate-footer mt-14 text-muted-foreground/50 text-sm opacity-0">
          Made with love, just for you
        </p>
      </div>
    </div>
  );
}
