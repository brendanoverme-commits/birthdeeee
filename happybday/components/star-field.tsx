"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

export function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shootingStarId = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";

    // Create subtle static stars for depth (very small, don't animate much)
    const staticStarCount = 80;
    for (let i = 0; i < staticStarCount; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 1.5 + 0.5;
      star.className = "static-star absolute rounded-full";
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
      `;
      container.appendChild(star);
    }

    // Gentle pulse for static stars - very subtle
    animate(".static-star", {
      opacity: [
        { to: 0.6, duration: 2000 },
        { to: 0.2, duration: 2000 },
      ],
      ease: "inOutSine",
      loop: true,
      delay: stagger(100, { from: "random" }),
    });

    // Create shooting stars with beautiful trails
    const createShootingStar = () => {
      const id = ++shootingStarId.current;
      const shootingStar = document.createElement("div");
      shootingStar.className = `shooting-star-${id}`;
      
      // Random starting position (top area, various x positions)
      const startX = Math.random() * 70 + 15; // 15-85% from left
      const startY = Math.random() * 30; // 0-30% from top
      
      shootingStar.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: ${startY}%;
        width: 3px;
        height: 3px;
        background: white;
        border-radius: 50%;
        box-shadow: 
          0 0 6px 2px rgba(255, 255, 255, 0.8),
          0 0 12px 4px rgba(114, 117, 148, 0.5);
        opacity: 0;
      `;
      
      // Create trail elements
      const trailCount = 12;
      const trail = document.createElement("div");
      trail.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: ${startY}%;
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(114,117,148,0.4), transparent);
        transform-origin: left center;
        transform: rotate(45deg);
        opacity: 0;
        filter: blur(0.5px);
      `;
      trail.className = `shooting-trail-${id}`;
      
      container.appendChild(trail);
      container.appendChild(shootingStar);

      // Animate with timeline for coordinated effect
      const tl = createTimeline({
        autoplay: true,
        complete: () => {
          shootingStar.remove();
          trail.remove();
        },
      });

      const distance = 400 + Math.random() * 200;
      const duration = 1200 + Math.random() * 400;

      tl.add(trail, {
        opacity: [0, 0.7, 0],
        scaleX: [0, 1, 0.5],
        translateX: [0, distance * 0.7],
        translateY: [0, distance * 0.7],
        duration: duration,
        ease: "outExpo",
      }, 0);

      tl.add(shootingStar, {
        opacity: [0, 1, 1, 0],
        translateX: [0, distance],
        translateY: [0, distance],
        scale: [1.5, 1, 0.5],
        duration: duration,
        ease: "outQuad",
      }, 0);
    };

    // Initial shooting stars
    setTimeout(createShootingStar, 1000);
    setTimeout(createShootingStar, 2500);

    // Periodic shooting stars
    const shootingInterval = setInterval(() => {
      createShootingStar();
      // Sometimes create multiple for meteor shower effect
      if (Math.random() > 0.7) {
        setTimeout(createShootingStar, 300);
      }
    }, 3500 + Math.random() * 2000);

    // Create occasional bright "wishing stars" that pulse
    const createWishingStar = () => {
      const star = document.createElement("div");
      const x = Math.random() * 100;
      const y = Math.random() * 60;
      
      star.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
      `;
      container.appendChild(star);

      animate(star, {
        scale: [0, 2, 0],
        opacity: [0, 1, 0],
        boxShadow: [
          "0 0 0 0 rgba(255,255,255,0)",
          "0 0 20px 10px rgba(114,117,148,0.6)",
          "0 0 0 0 rgba(255,255,255,0)",
        ],
        duration: 2500,
        ease: "inOutSine",
        complete: () => star.remove(),
      });
    };

    const wishingInterval = setInterval(createWishingStar, 5000);

    return () => {
      clearInterval(shootingInterval);
      clearInterval(wishingInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(114, 117, 148, 0.08) 0%, transparent 60%)",
      }}
    />
  );
}
