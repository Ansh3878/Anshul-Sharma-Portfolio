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
          className="loader-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.15, 1] }}
          role="status"
          aria-live="polite"
          aria-label={`Loading — ${GREETINGS[index]}`}
        >
          <div className="loader-content">
            {/* Static dot */}
            <span className="loader-dot" aria-hidden="true" />

            <div className="loader-clip">
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
                  className="loader-greeting"
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
