import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const GREETINGS = [
  "Hello",
  "नमस्ते",
  "Hola",
  "Ciao",
  "やあ",
];

// Gradual acceleration — each word holds a bit less and slides in a bit faster
const WORD_DURATIONS  = [580, 450, 330, 220, 130];
const TRANSITIONS     = [280, 240, 200, 165, 130];
const FONT_SIZE     = 56; // Slightly smaller to ensure fit
const LINE_H        = 80;
const CLIP_PAD      = 20; // Vertical padding inside clip so tall scripts don't get cropped
const CLIP_WIDTH    = 190; // Optimized width to keep text centered on screen

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [index, setIndex]     = useState(0);
  const [exiting, setExiting] = useState(false);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const hold  = WORD_DURATIONS[index];
    const slide = TRANSITIONS[index];
    if (index < GREETINGS.length - 1) {
      const t = setTimeout(() => setIndex((i) => i + 1), hold + slide);
      return () => clearTimeout(t);
    } else {
      const t1 = setTimeout(() => setExiting(true), hold + 100);
      const t2 = setTimeout(() => onComplete(), hold + 100 + 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [index, onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader-screen"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "#0a0a0a",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.15, 1] }}
        >
          {/* Centered wrapper block of constant width. Keeps dot still and text centered. */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              height: `${LINE_H}px`,
              gap: "12px",
            }}
          >
            {/* Static dot */}
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                flexShrink: 0,
              }}
            />

            {/* Clip window of fixed width — CLIP_PAD adds headroom for tall glyphs */}
            <div
              style={{
                height: `${LINE_H + CLIP_PAD * 2}px`,
                width: `${CLIP_WIDTH}px`,
                overflow: "hidden",
                position: "relative",
                paddingTop: `${CLIP_PAD}px`,
                paddingBottom: `${CLIP_PAD}px`,
                boxSizing: "border-box",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={{ y: "60%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-60%", opacity: 0 }}
                  transition={{
                    duration: TRANSITIONS[index] / 1000,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                  style={{
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    top: `${CLIP_PAD}px`,
                    left: 0,
                    width: "100%",
                    height: `${LINE_H}px`,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: `${FONT_SIZE}px`,
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {GREETINGS[index]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
