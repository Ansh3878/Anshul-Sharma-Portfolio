"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import ReactLenis from "lenis/react";
import { useEffect, useRef } from "react";

const smoothStep = (value: number) => value * value * (3 - 2 * value);

export interface StickyScrollCardItem {
  title: string;
  tagline?: string;
  desc?: string;
  tags?: string[];
  src: string;
  href?: string;
}

const DEFAULT_CARDS: StickyScrollCardItem[] = [
  {
    title: "Misty Alps",
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85",
  },
  {
    title: "Sunlit Grove",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85",
  },
  {
    title: "Turquoise Shore",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85",
  },
  {
    title: "Mountain Pass",
    src: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1200&q=85",
  },
  {
    title: "Rolling Hills",
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85",
  },
];

// Very subtle tilts — natural scatter without looking messy
const CARD_ROTATIONS = [-1.4, 1.0, -0.8, 1.6, -1.1];

interface StickyScrollCardProps {
  i: number;
  title: string;
  tagline?: string;
  desc?: string;
  tags?: string[];
  src: string;
  href?: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  targetScale: number;
}

function StickyScrollCard({
  i,
  title,
  tagline,
  desc,
  tags,
  src,
  href,
  progress,
  range,
  targetScale,
}: StickyScrollCardProps) {
  const scale = useTransform(progress, range, [1, targetScale], { ease: smoothStep });
  const entranceStart = Math.max(0, range[0] - 0.06);
  const entranceEnd = Math.min(0.88, range[0] + 0.1);
  const entranceY = useTransform(progress, [entranceStart, entranceEnd], [44, 0], {
    ease: smoothStep,
  });
  const opacity = useTransform(progress, [entranceStart, entranceEnd], [0.82, 1], {
    ease: smoothStep,
  });
  const rotation = useTransform(
    progress,
    [entranceStart, entranceEnd],
    [0, CARD_ROTATIONS[i % CARD_ROTATIONS.length]],
    { ease: smoothStep }
  );

  const cardContent = (
    <motion.div
      style={{
        scale,
        rotate: rotation,
        y: entranceY,
        opacity,
        top: `calc(-5vh + ${i * 22 + 160}px)`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        willChange: "transform, opacity",
      }}
      className="relative -top-1/4 origin-top overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 flex flex-col w-[500px] cursor-pointer hover:border-white/20 transition-colors"
    >
      <div className="w-full h-[280px] overflow-hidden relative">
        <img
          src={src}
          alt={title}
          className="block w-full h-full object-cover opacity-80"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
      </div>

      <div className="flex flex-col p-6 pt-0 -mt-10 relative z-10 h-[180px]">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          {tagline && (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/80 uppercase tracking-widest">
              {tagline}
            </span>
          )}
        </div>
        
        {desc && (
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-4">
            {desc}
          </p>
        )}

        {tags && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono uppercase tracking-[0.1em] text-zinc-500 bg-black/40 px-2.5 py-1 rounded border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-2xl">
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </div>
  );
}

interface StickyScrollCardsProps {
  /** Array of card items, each with a title and image src URL */
  cards?: StickyScrollCardItem[];
  /** Hint label shown above the stack */
  hint?: string;
  /** Additional CSS classes for the outer container */
  className?: string;
}

export function StickyScrollCards({
  cards = DEFAULT_CARDS,
  hint = "scroll to explore",
  className,
}: StickyScrollCardsProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.8,
    restDelta: 0.0005,
  });
  const hintOpacity = useTransform(smoothProgress, [0, 0.06, 0.16], [0, 1, 0], {
    ease: smoothStep,
  });
  const hintY = useTransform(smoothProgress, [0, 0.16], [12, -8], {
    ease: smoothStep,
  });

  // Hide the native scrollbar while this component is mounted
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "__sticky-scroll-cards-no-bar";
    style.textContent =
      "html { scrollbar-width: none; -ms-overflow-style: none; } html::-webkit-scrollbar { display: none; }";
    document.head.appendChild(style);
    return () => {
      document.getElementById("__sticky-scroll-cards-no-bar")?.remove();
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.85,
      }}
    >
      <main
        ref={container}
        className={cn(
          "relative flex w-full flex-col items-center justify-center pb-[80vh] pt-[32vh]",
          className
        )}
      >
        {/* Hint label */}
        <motion.div
          className="absolute left-1/2 top-[8%] flex -translate-x-1/2 flex-col items-center gap-3"
          style={{ opacity: hintOpacity, y: hintY }}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-30 text-white">
            {hint}
          </p>
          <span className="h-12 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>

        {cards.map((card, i) => {
          const targetScale = Math.max(0.5, 1 - (cards.length - i - 1) * 0.1);
          const scaleStart = i * (0.55 / Math.max(cards.length, 1));
          return (
            <StickyScrollCard
              key={`card_${i}`}
              i={i}
              {...card}
              progress={smoothProgress}
              range={[scaleStart, 0.9]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
}
