"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, createTimeline } from "animejs";

export function HeartParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Create sleek, minimalist heart SVG (outline style)
    const createHeartPath = (size: number, filled: boolean = false) => `
      <svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    `;

    // Create elegant floating hearts
    const createHeart = () => {
      const heart = document.createElement("div");
      const size = Math.random() * 16 + 8; // 8-24px - smaller, more delicate
      const isFilled = Math.random() > 0.7; // 30% filled, 70% outline
      const isGlowing = Math.random() > 0.6;
      
      heart.innerHTML = createHeartPath(size, isFilled);
      heart.className = "absolute pointer-events-none";
      
      const hue = Math.random() > 0.5 ? "var(--heart)" : "var(--primary)";
      const opacity = Math.random() * 0.3 + 0.15;
      
      heart.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -30px;
        color: ${hue};
        opacity: 0;
        ${isGlowing ? `filter: drop-shadow(0 0 ${size/4}px ${hue});` : ''}
      `;
      container.appendChild(heart);

      // Complex path animation using anime.js timeline
      const tl = createTimeline({
        autoplay: true,
        complete: () => heart.remove(),
      });

      const duration = Math.random() * 10000 + 8000;
      const swayAmount = Math.random() * 80 - 40;
      const rotateAmount = Math.random() * 60 - 30;

      // Elegant floating motion with multiple phases
      tl.add(heart, {
        translateY: [0, -window.innerHeight * 0.3],
        translateX: [0, swayAmount * 0.3],
        rotate: [0, rotateAmount * 0.3],
        opacity: [0, opacity],
        scale: [0.5, 1],
        duration: duration * 0.2,
        ease: "outCubic",
      }, 0);

      tl.add(heart, {
        translateY: [-window.innerHeight * 0.3, -window.innerHeight * 0.7],
        translateX: [swayAmount * 0.3, swayAmount],
        rotate: [rotateAmount * 0.3, rotateAmount],
        duration: duration * 0.5,
        ease: "linear",
      }, duration * 0.2);

      tl.add(heart, {
        translateY: [-window.innerHeight * 0.7, -window.innerHeight - 50],
        translateX: [swayAmount, swayAmount * 0.5],
        rotate: [rotateAmount, 0],
        opacity: [opacity, 0],
        scale: [1, 0.7],
        duration: duration * 0.3,
        ease: "inCubic",
      }, duration * 0.7);
    };

    // Create sparkle particles
    const createSparkle = () => {
      const sparkle = document.createElement("div");
      const size = Math.random() * 4 + 2;
      
      sparkle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 100}%;
        background: white;
        border-radius: 50%;
        opacity: 0;
      `;
      container.appendChild(sparkle);

      animate(sparkle, {
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
        duration: 1500 + Math.random() * 1000,
        ease: "inOutSine",
        complete: () => sparkle.remove(),
      });
    };

    // Initial batch
    for (let i = 0; i < 3; i++) {
      setTimeout(createHeart, i * 800);
    }

    // Periodic hearts - less frequent for elegance
    const heartInterval = setInterval(createHeart, 2500);
    const sparkleInterval = setInterval(createSparkle, 1500);

    return () => {
      clearInterval(heartInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1] overflow-hidden pointer-events-none"
    />
  );
}
