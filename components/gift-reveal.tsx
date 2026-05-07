"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { Gift, ChevronDown, Copy, Check, ShieldAlert, Eye, EyeOff } from "lucide-react";

interface GiftRevealProps {
  onContinue: () => void;
  isVisible: boolean;
}

export function GiftReveal({ onContinue, isVisible }: GiftRevealProps) {
  const [stage, setStage] = useState<"warning" | "gift" | "opened">("warning");
  const [copied, setCopied] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const hasAnimated = useRef(false);
  const giftBoxRef = useRef<HTMLDivElement>(null);

  // Replace these with the actual credentials
  const robloxUsername = "YourGiftedUsername";
  const robloxPassword = "YourSecretPassword";

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    setTimeout(() => setShowContent(true), 100);
  }, [isVisible]);

  useEffect(() => {
    if (!showContent || stage !== "warning") return;

    // Warning stage animations
    animate(".warning-icon", {
      scale: [0, 1.2, 1],
      rotate: [0, -10, 10, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: "easeOutElastic(1, 0.5)",
    });

    animate(".warning-text", {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: stagger(200, { start: 500 }),
      easing: "easeOutExpo",
    });

    animate(".warning-btn", {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 600,
      delay: 1500,
      easing: "easeOutExpo",
    });

  }, [showContent, stage]);

  const proceedToGift = () => {
    // Fade out warning
    animate(".warning-container", {
      opacity: [1, 0],
      scale: [1, 0.95],
      duration: 500,
      easing: "easeInExpo",
      complete: () => {
        setStage("gift");
      },
    });
  };

  useEffect(() => {
    if (stage !== "gift") return;

    // Animate gift entrance
    setTimeout(() => {
      animate(".gift-box", {
        scale: [0, 1.1, 1],
        rotate: [0, -5, 5, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutElastic(1, 0.6)",
      });
      animate(".gift-text", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 600,
        easing: "easeOutExpo",
      });
    }, 100);
  }, [stage]);

  const handleOpenGift = () => {
    if (!giftBoxRef.current) return;

    // Gift box shake
    animate(giftBoxRef.current, {
      rotate: [-3, 3, -3, 3, -2, 2, 0],
      duration: 600,
      easing: "easeInOutSine",
    });

    // Gift box explode open after shake
    setTimeout(() => {
      animate(giftBoxRef.current, {
        scale: [1, 1.5, 0],
        rotate: [0, 720],
        opacity: [1, 1, 0],
        duration: 800,
        easing: "easeInExpo",
      });

      // Create explosion particles
      setTimeout(() => {
        const container = document.querySelector(".explosion-container");
        if (!container) return;

        for (let i = 0; i < 40; i++) {
          const particle = document.createElement("div");
          const size = Math.random() * 8 + 4;
          const isHeart = Math.random() > 0.6;

          if (isHeart) {
            particle.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
          }

          particle.className = "absolute pointer-events-none";
          particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            background: ${isHeart ? "transparent" : Math.random() > 0.5 ? "#727594" : "#ff6b8a"};
            color: ${Math.random() > 0.5 ? "#727594" : "#ff6b8a"};
            border-radius: ${isHeart ? "0" : "50%"};
          `;
          container.appendChild(particle);

          const angle = (Math.PI * 2 * i) / 40;
          const distance = Math.random() * 200 + 100;

          animate(particle, {
            translateX: [0, Math.cos(angle) * distance],
            translateY: [0, Math.sin(angle) * distance],
            scale: [1, 0],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 0],
            duration: 1000 + Math.random() * 500,
            easing: "easeOutExpo",
            complete: () => particle.remove(),
          });
        }
      }, 400);

      // Show opened content
      setTimeout(() => {
        setStage("opened");
      }, 800);
    }, 600);
  };

  useEffect(() => {
    if (stage !== "opened") return;

    setTimeout(() => {
      animate(".revealed-content", {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutExpo",
      });

      animate(".credential-card", {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: stagger(200, { start: 400 }),
        easing: "easeOutExpo",
      });

      animate(".gift-continue", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 1200,
        easing: "easeOutExpo",
      });
    }, 100);
  }, [stage]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);

    // Copy feedback animation
    animate(`.copy-btn-${type}`, {
      scale: [1, 1.2, 1],
      duration: 300,
      easing: "easeOutElastic(1, 0.5)",
    });

    setTimeout(() => setCopied(null), 2000);
  };

  if (!showContent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="explosion-container pointer-events-none fixed inset-0 z-50" />

      {/* Parallax decorative elements */}
      <div
        className="absolute left-[15%] top-[25%] h-36 w-36 rounded-full opacity-20"
        data-parallax-speed="0.04"
        style={{
          background: "radial-gradient(circle, #727594 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Stage 1: Privacy Warning */}
        {stage === "warning" && (
          <div className="warning-container">
            <div className="warning-icon mb-8 flex justify-center" style={{ opacity: 0 }}>
              <div className="relative">
                <ShieldAlert className="h-20 w-20 text-primary" />
                <div className="absolute inset-0 h-20 w-20 bg-primary/20 blur-xl rounded-full" />
              </div>
            </div>

            <h2 className="warning-text glow-text mb-4 font-serif text-3xl font-light text-foreground md:text-4xl" style={{ opacity: 0 }}>
              Before You Open This...
            </h2>

            <p className="warning-text mb-6 font-serif text-lg text-muted-foreground" style={{ opacity: 0 }}>
              Make sure <span className="text-primary font-medium">nobody is looking</span> at your screen right now.
            </p>

            <p className="warning-text mb-8 font-serif text-base text-muted-foreground/80" style={{ opacity: 0 }}>
              This gift contains private account information that&apos;s just for you, Farah.
              <br />
              Keep it safe and don&apos;t let anyone else see it!
            </p>

            <button
              onClick={proceedToGift}
              className="warning-btn glow-box cursor-pointer rounded-full border-2 border-primary/50 bg-primary/10 px-10 py-4 font-serif text-lg text-foreground transition-all duration-300 hover:bg-primary/20 hover:border-primary"
              style={{ opacity: 0 }}
            >
              I&apos;m alone, show me!
            </button>
          </div>
        )}

        {/* Stage 2: Gift Box */}
        {stage === "gift" && (
          <>
            <div
              ref={giftBoxRef}
              onClick={handleOpenGift}
              className="gift-box group relative cursor-pointer mx-auto inline-block"
              style={{ opacity: 0 }}
            >
              <div className="glow-box relative rounded-2xl border-2 border-primary/50 bg-secondary/50 p-16 transition-all duration-300 group-hover:border-primary group-hover:bg-secondary/80">
                <Gift className="h-28 w-28 text-primary transition-transform duration-300 group-hover:scale-110" />

                {/* Animated shimmer */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden shimmer"
                />

                {/* Ribbon decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-8 rounded-full" style={{ background: "#ff6b8a" }} />
                </div>
              </div>
            </div>

            <p className="gift-text mt-8 font-serif text-xl text-muted-foreground" style={{ opacity: 0 }}>
              Tap the gift to open it
            </p>
          </>
        )}

        {/* Stage 3: Revealed Content */}
        {stage === "opened" && (
          <div className="revealed-content" style={{ opacity: 0 }}>
            <h2 className="glow-text mb-2 font-serif text-4xl font-light text-foreground md:text-5xl">
              A Roblox Account!
            </h2>
            <p className="mb-10 font-serif text-lg text-muted-foreground">
              I got this for you so we can play together
            </p>

            <div className="space-y-4 max-w-md mx-auto">
              {/* Username Card */}
              <div className="credential-card glow-box rounded-xl border border-primary/30 bg-secondary/50 p-5" style={{ opacity: 0 }}>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                      Username
                    </p>
                    <p className="mt-1 font-mono text-xl text-foreground">
                      {robloxUsername}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(robloxUsername, "username")}
                    className={`copy-btn-username cursor-pointer rounded-lg border-none bg-primary/20 p-3 transition-colors hover:bg-primary/40`}
                  >
                    {copied === "username" ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-primary" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Card */}
              <div className="credential-card glow-box rounded-xl border border-primary/30 bg-secondary/50 p-5" style={{ opacity: 0 }}>
                <div className="flex items-center justify-between">
                  <div className="text-left flex-1 mr-3">
                    <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                      Password
                    </p>
                    <p className="mt-1 font-mono text-xl text-foreground">
                      {showPassword ? robloxPassword : "••••••••••••"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer rounded-lg border-none bg-transparent p-2 text-muted-foreground hover:text-primary transition-colors mr-2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy(robloxPassword, "password")}
                    className={`copy-btn-password cursor-pointer rounded-lg border-none bg-primary/20 p-3 transition-colors hover:bg-primary/40`}
                  >
                    {copied === "password" ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-primary" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 font-serif text-sm font-medium" style={{ color: "#ff6b8a" }}>
              Change the password after you log in to keep it safe!
            </p>

            <button
              onClick={onContinue}
              className="gift-continue group mt-12 flex cursor-pointer flex-col items-center gap-2 border-none bg-transparent mx-auto"
              style={{ opacity: 0 }}
            >
              <span className="font-sans text-sm uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-primary">
                But wait, there&apos;s more...
              </span>
              <ChevronDown className="h-6 w-6 animate-bounce text-primary" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
