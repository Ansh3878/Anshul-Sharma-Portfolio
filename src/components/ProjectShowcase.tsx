import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { ExternalLink } from "lucide-react";
import { useRef } from "react";

interface Project {
  title: string;
  desc: string;
  tags: string[];
  image: string;
  href: string;
}

interface ProjectShowcaseProps {
  projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Adjusted for a more subtle, natural 3D tilt response (max 7 degrees tilt, organic spring feel)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 220, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className="w-full flex justify-center py-4">
      <motion.a
        ref={cardRef}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
        className="group relative block h-[380px] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-colors duration-300 cursor-pointer max-w-2xl w-full shadow-2xl"
      >
        {/* Full Card Background Image with 3D Depth */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ transform: "translateZ(-15px) scale(1.08)" }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="object-cover w-full h-full opacity-40 group-hover:opacity-50 group-active:opacity-50 group-focus:opacity-50 transition duration-700 ease-out group-hover:scale-[1.03] group-active:scale-[1.03] group-focus:scale-[1.03]"
          />
          {/* Ambient Vignette & Bottom Text Backing Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        {/* Live Badge (Top Left) */}
        <div
          className="absolute top-6 left-6 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-10"
          style={{ transform: "translateZ(10px)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">Live</span>
        </div>

        {/* Bottom Text Content with Pronounced 3D Depth */}
        <div
          className="absolute bottom-0 left-0 right-0 p-8 space-y-3 z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-white">{project.title}</h3>
            <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </div>

          {/* Shortened Description */}
          <p className="text-zinc-300 text-sm leading-relaxed max-w-xl line-clamp-2">
            {project.desc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag, ti) => (
              <span key={ti} className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.a>
    </div>
  );
}

const variants = {
  enter: (d: number) => ({
    x: d > 0 ? "35%" : "-35%",
    opacity: 0,
    scale: 0.97,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({
    x: d > 0 ? "-35%" : "35%",
    opacity: 0,
    scale: 0.97,
  }),
};

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prevIndex) => (prevIndex + newDirection + projects.length) % projects.length);
  };
  const prev = () => paginate(-1);
  const next = () => paginate(1);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Viewport */}
      <div className="relative overflow-visible min-h-[412px] w-full flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                next();
              } else if (swipe > swipeConfidenceThreshold) {
                prev();
              }
            }}
            style={{ willChange: "transform, opacity", touchAction: "pan-y" }}
            className="w-full"
          >
            <ProjectCard project={projects[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={prev}
          aria-label="Previous project"
          className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to project ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-white" : "w-2 bg-white/20 hover:bg-white/45"
                }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next project"
          className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
