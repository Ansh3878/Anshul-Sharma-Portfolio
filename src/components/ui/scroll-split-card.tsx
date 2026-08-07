"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
} from "motion/react";
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

const TEXTURE_URL = "https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256";

export function ScrollSplitCard({
  className,
  imageSrc,
  cards,
  containerRef: externalContainerRef,
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure initial screen size once, only re-evaluate on horizontal resize (orientation / window width change).
  // Ignoring height-only resizes avoids layout jumps when mobile address bars collapse/expand.
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === "undefined" ? 1440 : window.innerWidth,
    h: typeof window === "undefined" ? 900 : window.innerHeight,
  }));

  useEffect(() => {
    let lastWidth = window.innerWidth;
    const onResize = () => {
      // Only update if width actually changes to prevent address-bar height resize loops
      if (Math.abs(window.innerWidth - lastWidth) > 10) {
        lastWidth = window.innerWidth;
        setViewport({ w: window.innerWidth, h: window.innerHeight });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isPhone = viewport.w < 640;
  const isCompact = viewport.w < 1024;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.8,
    restDelta: 0.001,
  });

  // Responsive metrics scaled smoothly for mobile to desktop
  const CARD_H = isPhone ? Math.min(480, viewport.h * 0.58) : isCompact ? 460 : 550;
  const CARD_W = isPhone ? Math.max(300, viewport.w - 32) : isCompact ? Math.min(768, viewport.w - 64) : Math.min(1152, viewport.w);
  const splitDistance = isPhone ? 8 : isCompact ? 20 : 48;
  const cardTilt = isPhone ? 2 : isCompact ? 4 : 6;
  const finalCardsY = isPhone ? -30 : isCompact ? -80 : -160;

  // Transformations
  const combinedScale = useTransform(smoothProgress, [0.1, 0.4], [1, isPhone ? 0.98 : 0.9], { ease: smoothStep });
  
  const leftX = useTransform(smoothProgress, [0.1, 0.4], [0, -splitDistance], { ease: smoothStep });
  const rightX = useTransform(smoothProgress, [0.1, 0.4], [0, splitDistance], { ease: smoothStep });

  const rotateY = useTransform(smoothProgress, [0.4, 0.75], [0, 180], { ease: smoothStep });
  const rotateZLeft = useTransform(smoothProgress, [0.4, 0.75], [0, cardTilt], { ease: smoothStep });
  const rotateZRight = useTransform(smoothProgress, [0.4, 0.75], [0, -cardTilt], { ease: smoothStep });

  // Cross-browser JS face-swap (Firefox / Zen / Safari / Chrome compliant)
  const frontFaceOpacity = useTransform(rotateY, (r) => (r < 90 ? 1 : 0));
  const backFaceOpacity = useTransform(rotateY, (r) => (r >= 90 ? 1 : 0));

  const borderRadiusLeft = useTransform(
    smoothProgress, [0.1, 0.35],
    ["16px 0px 0px 16px", "16px 16px 16px 16px"],
    { ease: smoothStep }
  );
  const borderRadiusMiddle = useTransform(
    smoothProgress, [0.1, 0.35],
    ["0px 0px 0px 0px", "16px 16px 16px 16px"],
    { ease: smoothStep }
  );
  const borderRadiusRight = useTransform(
    smoothProgress, [0.1, 0.35],
    ["0px 16px 16px 0px", "16px 16px 16px 16px"],
    { ease: smoothStep }
  );

  const borderOpacity = useTransform(smoothProgress, [0.05, 0.35], [0.1, 0.2], { ease: smoothStep });
  const shadowOpacity = useTransform(smoothProgress, [0.05, 0.35], [0.2, 0.4], { ease: smoothStep });
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255,255,255,${borderOpacity}), inset 0 -24px 48px rgba(0,0,0,${shadowOpacity}), 0 25px 50px -12px rgba(0,0,0,${shadowOpacity})`;

  const cardsY = useTransform(smoothProgress, [0.65, 0.85], [0, finalCardsY], { ease: smoothStep });
  const textOpacity = useTransform(smoothProgress, [0.7, 0.88], [0, 1], { ease: smoothStep });
  const textY = useTransform(smoothProgress, [0.7, 0.88], [30, 0], { ease: smoothStep });
  const startTextOpacity = useTransform(smoothProgress, [0.01, 0.12], [1, 0], { ease: smoothStep });
  const startTextY = useTransform(smoothProgress, [0.01, 0.12], [0, 20], { ease: smoothStep });

  const getBR = (i: number) => i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle;

  return (
    <div
      ref={containerRef}
      className={cn("scroll-split-track relative w-full", className)}
      style={{ height: "350vh" }}
    >
      <div
        className="scroll-split-stage sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
        style={{ perspective: isPhone ? "1000px" : isCompact ? "1400px" : "1200px" }}
      >
        {/* Scroll hint */}
        <motion.div
          className="absolute top-[12%] left-0 right-0 text-center z-20 pointer-events-none"
          style={{ opacity: startTextOpacity, y: startTextY }}
        >
          <p className="text-xs sm:text-sm font-medium tracking-widest text-white/50 uppercase">Scroll down</p>
        </motion.div>

        {/* Card group container */}
        <motion.div
          style={{
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            scale: combinedScale,
            y: cardsY,
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
              }}
            >
              {/* Front Side: Split Image */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: 2, opacity: frontFaceOpacity, borderRadius: getBR(i), boxShadow }}
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

              {/* Back Side: Card Content */}
              <motion.div
                className={cn(
                  "scroll-split-card-back absolute inset-0 overflow-hidden flex flex-col justify-end p-4 sm:p-6",
                  "border border-white/5 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-24px_48px_rgba(0,0,0,0.2)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  opacity: backFaceOpacity,
                  transform: "scaleX(-1)", // Counteracts parent 180 Y-rotation flip
                  zIndex: 3,
                  borderRadius: getBR(i),
                  boxShadow,
                }}
              >
                <div
                  className="scroll-split-texture pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{ backgroundImage: `url("${TEXTURE_URL}")`, backgroundRepeat: "repeat" }}
                />
                <div className="scroll-split-card-icon relative z-10 mb-auto">{card.icon}</div>
                {card.features && (
                  <div className="scroll-split-card-features relative z-10 flex flex-col gap-1 my-2">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="scroll-split-card-feature flex items-start gap-1.5 opacity-90">
                        <div className="scroll-split-card-bullet shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-white/60" />
                        <span className="text-xs sm:text-sm leading-relaxed tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                <h3 className="scroll-split-card-title relative z-10 text-base sm:text-xl font-semibold tracking-tight leading-snug">{card.title}</h3>
                <p className="scroll-split-card-description relative z-10 text-xs sm:text-sm opacity-70 line-clamp-3 mt-1 leading-relaxed">{card.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending Text */}
        <motion.div
          className="scroll-split-ending absolute bottom-[10%] sm:bottom-[15%] left-0 right-0 text-center pointer-events-none"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="scroll-split-ending-text px-4 font-medium tracking-tight text-white font-serif italic text-base sm:text-xl">
            This is what I bring to the table.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
