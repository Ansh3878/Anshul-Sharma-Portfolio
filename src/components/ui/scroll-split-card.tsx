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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.8,
    restDelta: 0.0005,
  });

  // Target card size
  const CARD_H = 550;
  const CARD_W = Math.min(1152, viewport.w); // Remove padding subtraction

  // ─── Phase 1 (0 → 0.38): The entire card container shrinks from full viewport to card size ───
  // We want the width to transition from viewport.w to CARD_W, and height from viewport.h to CARD_H.
  // Slight phase overlap keeps the movement continuous between shrink, split, and flip.
  const combinedScale = useTransform(
    smoothProgress,
    [0.3, 0.6],
    [1, 0.9],
    { ease: smoothStep }
  );
  
  // ─── Phase 2 (0.42 → 0.72): Cards separate ───
  const leftX = useTransform(smoothProgress, [0.3, 0.6], [0, -48], { ease: smoothStep });
  const rightX = useTransform(smoothProgress, [0.3, 0.6], [0, 48], { ease: smoothStep });

  // ─── Phase 3 (0.72 → 1): Flip ───
  const rotateY = useTransform(smoothProgress, [0.55, 0.86], [0, 180], { ease: smoothStep });
  const rotateZLeft = useTransform(smoothProgress, [0.55, 0.86], [0, 6], { ease: smoothStep });
  const rotateZRight = useTransform(smoothProgress, [0.55, 0.86], [0, -6], { ease: smoothStep });

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

  const cardsY = useTransform(smoothProgress, [0.76, 0.92], [0, -200], { ease: smoothStep });

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

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[400vh] w-full", className)}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1200px]">

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
            width: outerWidth,
            height: outerHeight,
            scale: combinedScale, 
            y: cardsY, 
            transformStyle: "preserve-3d",
            willChange: "width, height, transform",
          }}
          className="flex relative max-w-full"
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
                  boxShadow,
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
                  "absolute inset-0 overflow-hidden flex flex-col justify-end p-8 [backface-visibility:hidden] will-change-transform",
                  "border border-white/5 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-24px_48px_rgba(0,0,0,0.2)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  transform: "rotateY(180deg)",
                  zIndex: 1,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256")`,
                    backgroundRepeat: "repeat",
                  }}
                />
                <div className="relative z-10 mb-auto">{card.icon}</div>
                {card.features && (
                  <div className="relative z-10 mb-10 flex flex-col gap-3.5">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm opacity-90">
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                        <span className="leading-relaxed tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                <h3 className="relative z-10 mb-4 text-3xl font-semibold tracking-tight">{card.title}</h3>
                <p className="relative z-10 text-base opacity-70 leading-relaxed">{card.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending text */}
        <motion.div
          className="absolute bottom-[20%] left-0 right-0 text-center pointer-events-none"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="text-3xl font-medium tracking-tight text-white font-serif italic">
            This is what I bring to the table.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
