import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AnimatedButton from "./AnimatedButton";

const CYCLING_WORDS = ["create", "design", "build"];

const GIF_URL =
  "https://media0.giphy.com/media/NEvPzZ8bd1V4Y/giphy.gif?cid=ecf05e47&rid=giphy.gif";

export default function CallToAction() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="cta-section relative py-16 px-6 max-w-4xl mx-auto border-t border-white/5">
      <div className="cta-layout flex flex-col lg:flex-row lg:items-center justify-between gap-10">

        {/* ── LEFT: Headline ── */}
        <motion.div
          className="cta-copy flex-1 select-none min-w-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="cta-heading text-white tracking-tighter leading-[0.9]"
            style={{ fontFamily: "var(--font-outfit)", fontWeight: 700 }}
          >
            {/* Line 1: "lets [animated word]"
                Invisible placeholder sets the true baseline/height.
                Animated word layers absolutely on top — same font = same baseline. */}
            <span
              className="cta-heading-line block"
              style={{ lineHeight: 1 }}
            >
              lets{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                {/* Invisible longest word — holds space & baseline */}
                <span
                  className="font-signature invisible select-none"
                  style={{ fontWeight: 400, whiteSpace: "nowrap" }}
                  aria-hidden
                >
                  design
                </span>
                {/* Animated word — sits exactly on top */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={CYCLING_WORDS[wordIndex]}
                    className="font-signature text-white"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      fontWeight: 400,
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                    }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {CYCLING_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>

            {/* Line 2 */}
            <motion.span
              className="cta-heading-line block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              incredible work
            </motion.span>

            {/* Line 3 */}
            <motion.span
              className="cta-heading-line block text-zinc-500"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              together.
            </motion.span>
          </h2>

          {/* CTA row */}
          <motion.div
            className="cta-actions mt-7 flex items-center gap-5 flex-wrap"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.32, duration: 0.6 }}
          >
            <AnimatedButton
              label="Get in touch"
              href="mailto:ansh1143@outlook.com"
            />
          </motion.div>
        </motion.div>

        {/* ── RIGHT: GIF card — tilted, white border ── */}
        <motion.div
          className="cta-media flex-shrink-0"
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.25, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cta-media-tilt">
            <div
              className="cta-media-frame overflow-hidden"
              style={{ border: "2.5px solid rgba(255,255,255,0.85)" }}
            >
              <img
                src={GIF_URL}
                alt="Let's build something great"
                className="cta-media-image w-full object-cover block"
                width="480"
                height="270"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
