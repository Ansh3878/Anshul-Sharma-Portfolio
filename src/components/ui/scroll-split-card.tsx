"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";

const smoothStep = (value: number) => value * value * (3 - 2 * value);

interface ScrollSplitCardItem {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
  features?: string[];
}

interface ScrollSplitCardProps {
  className?: string;
  imageSrc: string;
  cards: ScrollSplitCardItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrollSplitCard({
  className,
  imageSrc,
  cards,
  containerRef: externalContainerRef,
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track viewport size to calculate exact dimensions
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === "undefined" ? 1440 : window.innerWidth,
    h: typeof window === "undefined" ? 900 : window.innerHeight,
  }));
  useEffect(() => {
    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        setViewport({ w: window.innerWidth, h: window.innerHeight });
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const isCompact = viewport.w < 1024;
  const isPhone = viewport.w < 640;
  const isShortLandscape = isCompact && viewport.w > viewport.h && viewport.h < 600;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isPhone ? 76 : 120,
    damping: isPhone ? 30 : 24,
    mass: isPhone ? 0.6 : 0.8,
    restDelta: 0.0005,
  });

  // Keep the original desktop motion while tightening the geometry on smaller screens.
  const compactGutter = isPhone ? 24 : 48;
  const CARD_H = isCompact
    ? isShortLandscape
      ? Math.max(280, viewport.h * 0.7)
      : isPhone
        ? Math.min(420, Math.max(350, viewport.h * 0.54))
        : Math.min(460, Math.max(380, viewport.h * 0.52))
    : 550;
  const CARD_W = isCompact
    ? Math.max(240, viewport.w - compactGutter)
    : Math.min(1152, viewport.w);
  const finalScale = isCompact ? 0.96 : 0.9;
  const splitDistance = isCompact
    ? Math.min(20, Math.max(8, viewport.w * 0.025))
    : 48;
  const cardTilt = isCompact
    ? Math.min(4, Math.max(2, viewport.w / 220))
    : 6;
  const finalCardsY = isCompact
    ? isShortLandscape
      ? -Math.min(40, viewport.h * 0.08)
      : -Math.min(120, viewport.h * 0.14)
    : -200;

  // ─── Phase 1 (0 → 0.38): The entire card container shrinks from full viewport to card size ───
  // We want the width to transition from viewport.w to CARD_W, and height from viewport.h to CARD_H.
  // Slight phase overlap keeps the movement continuous between shrink, split, and flip.
  const combinedScale = useTransform(
    smoothProgress,
    [0.3, 0.6],
    [1, finalScale],
    { ease: smoothStep }
  );
  
  // ─── Phase 2 (0.42 → 0.72): Cards separate ───
  const leftX = useTransform(smoothProgress, [0.3, 0.6], [0, -splitDistance], { ease: smoothStep });
  const rightX = useTransform(smoothProgress, [0.3, 0.6], [0, splitDistance], { ease: smoothStep });

  // ─── Phase 3 (0.72 → 1): Flip ───
  const rotateY = useTransform(smoothProgress, [0.55, 0.86], [0, 180], { ease: smoothStep });
  const rotateZLeft = useTransform(smoothProgress, [0.55, 0.86], [0, cardTilt], { ease: smoothStep });
  const rotateZRight = useTransform(smoothProgress, [0.55, 0.86], [0, -cardTilt], { ease: smoothStep });

  // Border-radius on card panels: initially merged/flat joins, then rounded as they split
  const borderRadiusLeft = useTransform(smoothProgress, [0.02, 0.28, 0.34, 0.52], [
    "0px 0px 0px 0px", 
    "16px 0px 0px 16px", 
    "16px 0px 0px 16px", 
    "16px 16px 16px 16px"
  ], { ease: smoothStep });
  const borderRadiusMiddle = useTransform(smoothProgress, [0.02, 0.28, 0.34, 0.52], [
    "0px 0px 0px 0px", 
    "0px 0px 0px 0px", 
    "0px 0px 0px 0px", 
    "16px 16px 16px 16px"
  ], { ease: smoothStep });
  const borderRadiusRight = useTransform(smoothProgress, [0.02, 0.28, 0.34, 0.52], [
    "0px 0px 0px 0px", 
    "0px 16px 16px 0px", 
    "0px 16px 16px 0px", 
    "16px 16px 16px 16px"
  ], { ease: smoothStep });

  const borderOpacity = useTransform(smoothProgress, [0.28, 0.52], [0, 0.2], { ease: smoothStep });
  const shadowOpacity = useTransform(smoothProgress, [0.28, 0.52], [0, 0.4], { ease: smoothStep });
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  const cardsY = useTransform(smoothProgress, [0.76, 0.92], [0, finalCardsY], { ease: smoothStep });

  const textOpacity = useTransform(smoothProgress, [0.78, 0.92], [0, 1], { ease: smoothStep });
  const textY = useTransform(smoothProgress, [0.78, 0.92], [40, 0], { ease: smoothStep });

  const startTextOpacity = useTransform(smoothProgress, [0.01, 0.13], [1, 0], { ease: smoothStep });
  const startTextY = useTransform(smoothProgress, [0.01, 0.13], [0, 20], { ease: smoothStep });

  // Outer container dimensions scale smoothly
  const outerWidth = useTransform(
    smoothProgress,
    [0.02, 0.34],
    [`${viewport.w}px`, `${CARD_W}px`],
    { ease: smoothStep }
  );
  const outerHeight = useTransform(
    smoothProgress,
    [0.02, 0.34],
    [`${viewport.h}px`, `${CARD_H}px`],
    { ease: smoothStep }
  );
  const mobileScaleX = useTransform(
    smoothProgress,
    [0.02, 0.34],
    [viewport.w / CARD_W, 1],
    { ease: smoothStep }
  );
  const mobileScaleY = useTransform(
    smoothProgress,
    [0.02, 0.34],
    [viewport.h / CARD_H, 1],
    { ease: smoothStep }
  );
  const mobileShadow = "0 14px 30px -14px rgba(0, 0, 0, 0.55)";

  return (
    <div
      ref={containerRef}
      className={cn("scroll-split-track relative w-full", className)}
    >
      <div
        className="scroll-split-stage sticky top-0 flex w-full items-center justify-center overflow-hidden"
        style={{ perspective: isCompact ? "1800px" : "1200px" }}
      >

        {/* Scroll hint */}
        <motion.div
          className="absolute top-[15%] left-0 right-0 text-center z-20 pointer-events-none"
          style={{ opacity: startTextOpacity, y: startTextY }}
        >
          <p className="text-sm font-medium tracking-widest text-white/50 uppercase">Scroll down</p>
        </motion.div>

        {/* ── Card group: starts full-screen, scales/decreases size down to card layout ── */}
        <motion.div
          style={{ 
            width: isPhone ? `${CARD_W}px` : outerWidth,
            height: isPhone ? `${CARD_H}px` : outerHeight,
            scale: combinedScale,
            scaleX: isPhone ? mobileScaleX : 1,
            scaleY: isPhone ? mobileScaleY : 1,
            y: cardsY, 
            transformStyle: "preserve-3d",
            willChange: isPhone ? "transform" : "width, height, transform",
          }}
          className="scroll-split-card-group flex relative max-w-full"
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={i}
              className="relative h-full flex-1"
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* Front Side: Image Split */}
              <motion.div
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                style={{
                  zIndex: 2,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow: isPhone ? mobileShadow : boxShadow,
                }}
              >
                <div
                  className="absolute inset-0 h-full w-[300%]"
                  style={{
                    left: `${-100 * i}%`,
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </motion.div>

              {/* Back Side: Content Card */}
              <motion.div
                className={cn(
                  "scroll-split-card-back absolute inset-0 overflow-hidden flex flex-col justify-end [backface-visibility:hidden] will-change-transform",
                  "border border-white/5 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-24px_48px_rgba(0,0,0,0.2)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  transform: "rotateY(180deg)",
                  zIndex: 1,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow: isPhone ? mobileShadow : boxShadow,
                }}
              >
                <div
                  className="scroll-split-texture pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256")`,
                    backgroundRepeat: "repeat",
                  }}
                />
                <div className="scroll-split-card-icon relative z-10 mb-auto">{card.icon}</div>
                {card.features && (
                  <div className="scroll-split-card-features relative z-10 flex flex-col">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="scroll-split-card-feature flex items-start opacity-90">
                        <div className="scroll-split-card-bullet shrink-0 rounded-full bg-white/60" />
                        <span className="leading-relaxed tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                <h3 className="scroll-split-card-title relative z-10 font-semibold tracking-tight">{card.title}</h3>
                <p className="scroll-split-card-description relative z-10 opacity-70">{card.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending text */}
        <motion.div
          className="scroll-split-ending absolute left-0 right-0 text-center pointer-events-none"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="scroll-split-ending-text px-4 font-medium tracking-tight text-white font-serif italic">
            This is what I bring to the table.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
