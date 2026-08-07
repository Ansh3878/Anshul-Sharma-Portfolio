"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

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
const CARD_FACE_SHADOW = "inset 0 1px 1px rgba(255,255,255,0.16), inset 0 -24px 48px rgba(0,0,0,0.32), 0 25px 50px -12px rgba(0,0,0,0.32)";

export function ScrollSplitCard({
  className,
  imageSrc,
  cards,
  containerRef: externalContainerRef,
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cardTriggerRef = useRef<HTMLDivElement | null>(null);
  const [activeCard, setActiveCard] = useState<ScrollSplitCardItem | null>(null);

  // Measure initial screen size once, only re-evaluate on horizontal resize (orientation / window width change).
  // Ignoring height-only resizes avoids layout jumps when mobile address bars collapse/expand.
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === "undefined" ? 1440 : window.innerWidth,
    h: typeof window === "undefined" ? 900 : window.innerHeight,
  }));

  useEffect(() => {
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    const onResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const widthChanged = Math.abs(nextWidth - lastWidth) > 10;
      const desktopHeightChanged = nextWidth >= 1024 && Math.abs(nextHeight - lastHeight) > 10;

      // Desktop needs a true full-screen opening panel. On mobile, ignore
      // height-only changes caused by browser chrome expanding/collapsing.
      if (widthChanged || desktopHeightChanged) {
        lastWidth = nextWidth;
        lastHeight = nextHeight;
        setViewport({ w: nextWidth, h: nextHeight });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isPhone = viewport.w < 640;
  const isCompact = viewport.w < 1024;

  useEffect(() => {
    if (!activeCard) return;

    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveCard(null);
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      cardTriggerRef.current?.focus({ preventScroll: true });
    };
  }, [activeCard]);

  useEffect(() => {
    if (!isCompact) setActiveCard(null);
  }, [isCompact]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: ["start start", "end end"],
  });

  // Responsive metrics scaled smoothly for mobile to desktop
  const CARD_H = isPhone ? Math.min(360, Math.max(300, viewport.h * 0.46)) : isCompact ? 460 : 550;
  const CARD_W = isPhone ? Math.max(280, viewport.w - 24) : isCompact ? Math.min(768, viewport.w - 64) : Math.min(1152, viewport.w);
  const splitDistance = isPhone ? 8 : isCompact ? 20 : 48;
  const cardTilt = isPhone ? 2 : isCompact ? 4 : 6;
  const finalCardsY = isPhone ? -30 : isCompact ? -80 : -160;

  // Transformations
  // Desktop sequence: full viewport -> framed artwork -> split -> flip.
  // Compact layouts keep their existing sizing and timing.
  const groupWidth = useTransform(
    scrollYProgress,
    [0, 0.22],
    [isCompact ? CARD_W : viewport.w, CARD_W],
    { ease: smoothStep }
  );
  const groupHeight = useTransform(
    scrollYProgress,
    [0, 0.22],
    [isCompact ? CARD_H : viewport.h, CARD_H],
    { ease: smoothStep }
  );

  const splitRange = isCompact ? [0.1, 0.4] : [0.3, 0.52];
  const flipRange = isCompact ? [0.4, 0.75] : [0.52, 0.78];
  const scaleRange = isCompact ? [0.1, 0.4] : [0.3, 0.52];

  const combinedScale = useTransform(scrollYProgress, scaleRange, [1, isPhone ? 0.98 : 0.9], { ease: smoothStep });

  const leftX = useTransform(scrollYProgress, splitRange, [0, -splitDistance], { ease: smoothStep });
  const rightX = useTransform(scrollYProgress, splitRange, [0, splitDistance], { ease: smoothStep });

  const rotateY = useTransform(scrollYProgress, flipRange, [0, 180], { ease: smoothStep });
  const rotateZLeft = useTransform(scrollYProgress, flipRange, [0, cardTilt], { ease: smoothStep });
  const rotateZRight = useTransform(scrollYProgress, flipRange, [0, -cardTilt], { ease: smoothStep });

  // Cross-browser JS face-swap (Firefox / Zen / Safari / Chrome compliant)
  const frontFaceOpacity = useTransform(rotateY, (r) => (r < 90 ? 1 : 0));
  const backFaceOpacity = useTransform(rotateY, (r) => (r >= 90 ? 1 : 0));

  const borderRadiusLeft = useTransform(
    scrollYProgress,
    isCompact ? [0.1, 0.35] : [0, 0.22, 0.52],
    isCompact
      ? ["16px 0px 0px 16px", "16px 16px 16px 16px"]
      : ["0px", "16px 0px 0px 16px", "16px 16px 16px 16px"],
    { ease: smoothStep }
  );
  const borderRadiusMiddle = useTransform(
    scrollYProgress,
    isCompact ? [0.1, 0.35] : [0, 0.22, 0.52],
    isCompact
      ? ["0px 0px 0px 0px", "16px 16px 16px 16px"]
      : ["0px", "0px", "16px 16px 16px 16px"],
    { ease: smoothStep }
  );
  const borderRadiusRight = useTransform(
    scrollYProgress,
    isCompact ? [0.1, 0.35] : [0, 0.22, 0.52],
    isCompact
      ? ["0px 16px 16px 0px", "16px 16px 16px 16px"]
      : ["0px", "0px 16px 16px 0px", "16px 16px 16px 16px"],
    { ease: smoothStep }
  );

  const cardsY = useTransform(scrollYProgress, isCompact ? [0.65, 0.85] : [0.75, 0.9], [0, finalCardsY], { ease: smoothStep });
  const endingTextStart = isCompact ? 0.65 : 0.68;
  const endingTextEnd = 0.76;
  const textOpacity = useTransform(scrollYProgress, (progress) => {
    const revealProgress = Math.min(
      1,
      Math.max(0, (progress - endingTextStart) / (endingTextEnd - endingTextStart))
    );
    return smoothStep(revealProgress);
  });
  const textRevealY = useTransform(textOpacity, (opacity) => 24 * (1 - opacity));
  const endingTextGap = isPhone ? 40 : isCompact ? 48 : 56;
  const endingTextY = useTransform(
    [groupHeight, combinedScale, cardsY, textRevealY],
    ([height, scale, cardOffset, revealOffset]) =>
      (Number(height) * Number(scale)) / 2
      + Number(cardOffset)
      + endingTextGap
      + Number(revealOffset)
  );
  const startTextOpacity = useTransform(scrollYProgress, [0.01, 0.12], [1, 0], { ease: smoothStep });
  const startTextY = useTransform(scrollYProgress, [0.01, 0.12], [0, 20], { ease: smoothStep });

  const getBR = (i: number) => i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle;

  return (
    <div
      ref={containerRef}
      className={cn("scroll-split-track relative w-full", className)}
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
            width: groupWidth,
            height: groupHeight,
            scale: combinedScale,
            y: cardsY,
            contain: "layout style",
            willChange: "width, height, transform",
          }}
          className="scroll-split-card-group flex relative max-w-full"
        >

          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={i}
              className={cn(
                "relative h-full flex-1",
                isCompact && "cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              )}
              role={isCompact ? "button" : undefined}
              tabIndex={isCompact ? 0 : undefined}
              aria-label={isCompact ? `View full details for ${card.title}` : undefined}
              onClick={(event) => {
                if (!isCompact || rotateY.get() < 90) return;
                cardTriggerRef.current = event.currentTarget;
                setActiveCard(card);
              }}
              onKeyDown={(event) => {
                if (!isCompact || rotateY.get() < 90 || (event.key !== "Enter" && event.key !== " ")) return;
                event.preventDefault();
                cardTriggerRef.current = event.currentTarget;
                setActiveCard(card);
              }}
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* Front Side: Split Image */}
              <motion.div
                className="scroll-split-card-front absolute inset-0 overflow-hidden"
                style={{
                  zIndex: 2,
                  opacity: frontFaceOpacity,
                  borderRadius: getBR(i),
                  boxShadow: CARD_FACE_SHADOW,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  contain: "paint",
                  willChange: "opacity",
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

              {/* Back Side: Card Content */}
              <motion.div
                className={cn(
                  "scroll-split-card-back absolute inset-0 overflow-hidden flex flex-col justify-end p-3 sm:p-6",
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
                  boxShadow: CARD_FACE_SHADOW,
                  contain: "paint",
                  willChange: "opacity",
                }}
              >
                <div
                  className="scroll-split-texture pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{ backgroundImage: `url("${TEXTURE_URL}")`, backgroundRepeat: "repeat" }}
                />
                {isCompact && (
                  <span
                    className="absolute right-2 top-2 z-20 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/15 text-white/80 backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
                    </svg>
                  </span>
                )}
                <div className="scroll-split-card-icon relative z-10 mb-auto">{card.icon}</div>
                {card.features && (
                  <div className="scroll-split-card-features relative z-10 flex flex-col gap-0.5 my-1 sm:my-2">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="scroll-split-card-feature flex items-start gap-1 opacity-90">
                        <div className="scroll-split-card-bullet shrink-0 w-1 h-1 mt-1.5 rounded-full bg-white/60" />
                        <span className="text-[11px] sm:text-sm leading-tight sm:leading-relaxed tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                <h3 className="scroll-split-card-title relative z-10 text-sm sm:text-xl font-semibold tracking-tight leading-snug">{card.title}</h3>
                <p className="scroll-split-card-description relative z-10 text-[11px] sm:text-sm opacity-70 line-clamp-2 sm:line-clamp-3 mt-0.5 sm:mt-1 leading-normal sm:leading-relaxed">{card.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending Text */}
        <motion.div
          className="scroll-split-ending absolute top-1/2 left-0 right-0 text-center pointer-events-none"
          style={{ opacity: textOpacity, y: endingTextY }}
        >
          <p className="scroll-split-ending-text px-4 font-medium tracking-tight text-white font-serif italic text-base sm:text-xl">
            That&apos;s all I bring to the table.
          </p>
        </motion.div>
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeCard && isCompact && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveCard(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="scroll-split-dialog-title"
                aria-describedby="scroll-split-dialog-description"
                className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-y-auto overscroll-contain rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
                style={{
                  backgroundColor: activeCard.bgColor,
                  color: activeCard.textColor,
                  boxShadow: CARD_FACE_SHADOW,
                }}
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                onClick={(event) => event.stopPropagation()}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{ backgroundImage: `url("${TEXTURE_URL}")`, backgroundRepeat: "repeat" }}
                />

                <button
                  ref={closeButtonRef}
                  type="button"
                  className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/20 text-white transition-colors hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={`Close ${activeCard.title} details`}
                  onClick={() => setActiveCard(null)}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>

                <div className="relative z-10 mb-14">{activeCard.icon}</div>

                {activeCard.features && (
                  <div className="relative z-10 mb-6 flex flex-col gap-3">
                    {activeCard.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm leading-relaxed opacity-90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                <h3 id="scroll-split-dialog-title" className="relative z-10 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {activeCard.title}
                </h3>
                <p id="scroll-split-dialog-description" className="relative z-10 mt-4 text-base leading-relaxed opacity-80 sm:text-lg">
                  {activeCard.description}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
