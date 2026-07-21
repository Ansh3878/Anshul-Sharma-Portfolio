import { useEffect, useId, useState } from "react";
import { motion } from "motion/react";
import * as opentype from "opentype.js";
import { cn } from "@/lib/utils";

interface SignatureProps {
  text?: string;
  color?: string;
  fontSize?: number;
  duration?: number;
  delay?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
  fontUrl?: string;
}

export function Signature({
  text = "Signature",
  color = "currentColor",
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [svgWidth, setSvgWidth] = useState(300);
  const [ready, setReady] = useState(false);

  const height = fontSize * 3;
  const baseline = fontSize * 1.5;
  const hPad = fontSize * 0.1;
  const maskId = `sig-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const candidates = fontUrl
        ? [fontUrl]
        : [
            "/LastoriaBoldRegular.otf",
            "https://www.componentry.fun/LastoriaBoldRegular.otf",
          ];

      let font: opentype.Font | null = null;

      for (const src of candidates) {
        try {
          // Use fetch + parse instead of opentype.load (which is callback-based, not promise-based)
          const res = await fetch(src);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const buf = await res.arrayBuffer();
          font = opentype.parse(buf);
          break;
        } catch (e) {
          console.warn("Signature: failed to load font from", src, e);
        }
      }

      if (!font || cancelled) {
        console.error("Signature: could not load any font");
        return;
      }

      let x = hPad;
      const newPaths: string[] = [];

      for (const char of text) {
        const glyph = font.charToGlyph(char);
        const p = glyph.getPath(x, baseline, fontSize);
        newPaths.push(p.toPathData(3));
        const advance = glyph.advanceWidth ?? font.unitsPerEm;
        x += advance * (fontSize / font.unitsPerEm);
      }

      if (!cancelled) {
        setPaths(newPaths);
        setSvgWidth(x + hPad);
        setReady(true);
      }
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontSize, fontUrl]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  if (!ready) return null;

  return (
    <motion.svg
      width={svgWidth}
      height={height}
      viewBox={`0 0 ${svgWidth} ${height}`}
      fill="none"
      className={cn("overflow-visible", className)}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.22}
              fill="none"
              variants={variants}
              transition={{
                pathLength: { delay: delay + i * 0.2, duration, ease: "easeInOut" },
                opacity:    { delay: delay + i * 0.2 + 0.01, duration: 0.01 },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: { delay: delay + i * 0.2, duration, ease: "easeInOut" },
            opacity:    { delay: delay + i * 0.2 + 0.01, duration: 0.01 },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => <path key={i} d={d} fill={color} />)}
      </g>
    </motion.svg>
  );
}
