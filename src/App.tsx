/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  ArrowUpRight,
  Menu,
  X,
  Globe,
  Layers,
  Zap,
  Terminal,
  Binary,
  Brackets,
  FileCode,
  Database,
  Monitor,
  Cloud,
  GitBranch,
  Cpu,
  ShieldCheck,
  Github,
  Linkedin,
  Mail,
  Sparkles
} from "lucide-react";

import { LightRays } from "@/src/components/ui/light-rays.js"
import AnimatedButton from "@/src/components/AnimatedButton"
import { ScrollProgressBar } from "@/src/components/ScrollProgressBar"
import { SmoothCursor } from "@/src/components/SmoothCursor"
import LogoLoop from "@/src/components/ui/logo-loop"
import CallToAction from "@/src/components/CallToAction"
import Loader from "@/src/components/Loader"
import { StickyScrollCards } from "@/src/components/StickyScrollCards"
import { Signature } from "@/src/components/ui/signature"
import { ScrollSplitCard } from "@/src/components/ui/scroll-split-card";
import { cn } from "@/lib/utils";

// --- Shared animation variants ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// --- Components ---

const Navbar = ({ onOpen }: { onOpen: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 py-4">
      <div className={cn(
        "flex h-14 w-full items-center justify-between rounded-full border border-white/10 bg-neutral-950/80 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-[max-width] duration-500 ease-out",
        isScrolled ? "max-w-xl" : "max-w-5xl"
      )}>
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex cursor-pointer items-center gap-2 font-signature text-2xl font-bold tracking-wider text-white transition-opacity duration-300 hover:opacity-80"
        >
          <span>AS</span>
        </div>
        <button
          onClick={onOpen}
          className="group flex items-center justify-center rounded-full border border-transparent p-2 transition-all duration-300 hover:border-white/10 hover:bg-white/10"
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5 text-zinc-300 transition-all duration-300 group-hover:text-white" />
        </button>
      </div>
    </nav>
  );
};

const SideMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        />

        {/* Menu Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
          className="fixed top-0 right-0 h-full w-[85vw] md:w-[30vw] bg-black z-[70] p-8 md:p-12 flex flex-col border-l border-white/10"
        >
          <div className="flex justify-start mb-20">
            <button
              onClick={onClose}
              className="group flex items-center gap-3 text-white hover:opacity-70 transition-all font-mono uppercase text-sm tracking-widest"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            {[
              { name: "HOME", num: "01", href: "#hero" },
              { name: "ABOUT", num: "02", href: "#about" },
              { name: "EDUCATION", num: "03", href: "#education" },
              { name: "PROJECTS", num: "04", href: "#projects" },
              { name: "CONTACT", num: "05", href: "mailto:ansh1143@outlook.com" }
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
                className="group flex items-start gap-4"
              >
                <span className="text-4xl md:text-[3.2vw] font-black text-white hover:text-zinc-500 transition-colors uppercase leading-[0.9] tracking-tighter">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-600 group-hover:text-white transition-colors mt-0">{item.num}</span>
              </motion.a>
            ))}
          </div>

          <div className="mt-auto pt-12 border-t border-white/5">
            <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
              Anshul Sharma Portfolio © 2026
            </p>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Hero = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <section
      id="hero"
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <h1 id="hero-title" className="sr-only">Anshul Sharma</h1>

      {isVisible && (
        <div className="hero-signature-frame" aria-hidden="true">
          <Signature
            text="Anshul Sharma"
            fontSize={96}
            duration={1.2}
            delay={0.5}
            color="#ffffff"
            className="hero-signature"
          />
        </div>
      )}
    </section>
  );
};

const ScrollSplitSection = () => {
  return (
    <ScrollSplitCard
      imageSrc="/img/ascii-magic-1.png"
      cards={[
        {
          title: "Full-Stack Engineering",
          description: "Building scalable, high-performance web systems and modern architectures using React, Next.js, and Python.",
          bgColor: "#111111",
          textColor: "#ffffff",
          icon: <Terminal className="w-6 h-6 text-white/70 stroke-[1.5]" />
        },
        {
          title: "AI Integration",
          description: "Leveraging LLMs and computer vision to build intelligent, forward-looking applications that solve real problems.",
          bgColor: "#1a5bcf",
          textColor: "#ffffff",
          icon: <Sparkles className="w-6 h-6 text-white/70 stroke-[1.5]" />
        },
        {
          title: "Cybersecurity",
          description: "Implementing robust security patterns, zero-knowledge architectures, and secure data handling from the ground up.",
          bgColor: "#153d2e",
          textColor: "#ffffff",
          icon: <ShieldCheck className="w-6 h-6 text-white/70 stroke-[1.5]" />
        },
      ]}
    />
  );
};

const About = () => (
  <motion.section
    id="about"
    className="mx-auto max-w-4xl border-t border-white/5 px-6 py-24"
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
  >
    <div className="text-left">
      <motion.h2 variants={fadeLeft} className="text-4xl font-black uppercase tracking-tighter text-white md:text-5xl">
        About Me
      </motion.h2>

      <motion.div variants={staggerContainer} className="mt-12 max-w-3xl space-y-6">
        <motion.p variants={staggerItem} className="text-xl leading-relaxed text-zinc-300 md:text-2xl md:leading-relaxed">
          I’m a full-stack developer and cybersecurity enthusiast based in India,
          building secure, high-performance digital products.
        </motion.p>
        <motion.p variants={staggerItem} className="text-base leading-7 text-zinc-500 md:text-lg md:leading-8">
          With a B.Tech in Computer Science, I work across modern web development,
          AI integrations, and application security. I care about clean architecture,
          thoughtful user experiences, and software that performs reliably.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="mt-10 flex flex-col gap-8 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-end sm:justify-between"
      >
        <AnimatedButton
          label="View Resume"
          href="https://drive.google.com/file/d/1aXdUiuedu5qcfvQK974La_vbCfEVW09Q/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        />

        <div className="sm:text-right">
          <div className="select-none font-signature text-3xl text-white/80">Anshul Sharma</div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            Founder & Lead Engineer at Matrix AI
          </p>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

const ALL_TECH = [
  { name: "Next.js", icon: Globe },
  { name: "React", icon: Layers },
  { name: "Tailwind", icon: Zap },
  { name: "JavaScript", icon: Terminal },
  { name: "Python", icon: Binary },
  { name: "C++", icon: Brackets },
  { name: "HTML", icon: FileCode },
  { name: "CSS", icon: Zap },
  { name: "SQL", icon: Database },
  { name: "PostgreSQL", icon: Database },
  { name: "Linux", icon: Monitor },
  { name: "AWS", icon: Cloud },
  { name: "Git", icon: GitBranch },
  { name: "Vite", icon: Zap },
  { name: "Gemini API", icon: Cpu },
  { name: "Prisma", icon: ShieldCheck },
];

const createTechLogoNode = (stack: typeof ALL_TECH[0], index: number) => (
  <div key={index} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full hover:bg-white/[0.05] transition-all group cursor-none">
    <stack.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
    <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{stack.name}</span>
  </div>
);

const techLogos1 = ALL_TECH.map((stack, i) => ({
  node: createTechLogoNode(stack, i)
}));

const techLogos2 = [...ALL_TECH].reverse().map((stack, i) => ({
  node: createTechLogoNode(stack, i)
}));

const Stacks = () => (
  <motion.section
    className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5 overflow-hidden"
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
  >
    <div className="space-y-12">
      <motion.h2
        variants={fadeUp}
        className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase"
      >
        Current Stack
      </motion.h2>
      <motion.div
        variants={fadeUp}
        custom={0.1}
        className="flex flex-col gap-6 relative"
      >
        <LogoLoop
          logos={techLogos1}
          speed={60}
          direction="left"
          logoHeight={48}
          gap={24}
          fadeOut
          fadeOutColor="#0a0a0a"
          hoverSpeed={0}
        />
        <LogoLoop
          logos={techLogos2}
          speed={60}
          direction="right"
          logoHeight={48}
          gap={24}
          fadeOut
          fadeOutColor="#0a0a0a"
          hoverSpeed={0}
        />
      </motion.div>
    </div>
  </motion.section>
);

const EXPERIENCE_ITEMS = [
  {
    role: "Frontend Development Intern",
    company: "IBM",
    description:
      "Built responsive, high-performance web applications using React.js. Collaborated in agile teams to integrate APIs and deliver accessible UI components.",
    skills: ["React.js", "API Integration", "Agile", "UI/UX"],
  },
  {
    role: "Web Development Intern",
    company: "Next24tech",
    description:
      "Developed and deployed 5+ responsive web projects. Designed interactive UI components and optimized performance in agile environments.",
    skills: ["Next.js", "Tailwind", "JavaScript", "Optimization"],
  },
];

const Experience = () => (
  <section
    id="experience"
    className="mx-auto max-w-4xl border-t border-white/5 px-6 py-24"
  >
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className="text-4xl font-black uppercase tracking-tighter text-white md:text-5xl"
    >
      Experience
    </motion.h2>

    <div className="mt-12 space-y-3">
      {EXPERIENCE_ITEMS.map((experience, index) => (
        <motion.article
          key={`${experience.company}-${experience.role}`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="group relative -mx-4 overflow-hidden rounded-2xl px-4"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.035] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-5 py-8 md:grid-cols-[3rem_minmax(0,1fr)] md:items-start md:gap-x-6 md:py-9">
            <motion.div variants={staggerItem} className="flex items-center gap-2 pt-1">
              <span className="font-mono text-[10px] text-zinc-700 transition-colors duration-300 group-hover:text-zinc-400">
                0{index + 1}
              </span>
              <span className="h-px w-2 bg-zinc-800 transition-all duration-500 group-hover:w-5 group-hover:bg-zinc-500" />
            </motion.div>

            <motion.div variants={staggerContainer} className="min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-1">
              <motion.h3 variants={staggerItem} className="text-lg font-semibold leading-snug tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-white md:text-xl">
                {experience.role}
                <span className="font-medium text-zinc-500"> at {experience.company}</span>
              </motion.h3>
              <motion.p variants={staggerItem} className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 md:text-base md:leading-7">
                {experience.description}
              </motion.p>
              <motion.div variants={staggerItem} className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                {experience.skills.map((skill, skillIndex) => (
                  <span key={skill} className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600 transition-colors duration-300 group-hover:text-zinc-400">
                    {skillIndex > 0 && <span className="h-1 w-1 rounded-full bg-zinc-800" />}
                    {skill}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

interface Project {
  title: string;
  tagline?: string;
  desc: string;
  tags: string[];
  image: string;
  href: string;
}

const PROJECTS: Project[] = [
  {
    title: "Keepr",
    tagline: "Zero-Knowledge Security Suite",
    desc: "A client-side encrypted workspace for secure file sharing, persistent storage vaults with dead-man switches, and ephemeral WebSocket chat.",
    tags: ["React", "AWS Serverless", "Web Crypto", "Clerk"],
    image: "/img/keepr_image.png",
    href: "https://keepr-4j2p.onrender.com",
  },
  {
    title: "Matrix AI",
    tagline: "Career Companion",
    desc: "A modern workspace utilising Gemini AI to transform how professionals manage their career growth and technical skill acquisition.",
    tags: ["Next.js", "Gemini API", "Tailwind"],
    image: "/img/matrix-image.png",
    href: "https://matrix-ai-psi.vercel.app/",
  },
  {
    title: "CropDoc",
    tagline: "AI Agricultural Platform",
    desc: "An AI-powered platform for real-time crop disease detection using computer vision to provide actionable treatment recommendations for farmers.",
    tags: ["Next.js", "PostgreSQL", "OpenAI", "ML"],
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1400",
    href: "https://crop-doc-rho.vercel.app/",
  },
];

const STICKY_CARDS = PROJECTS.map(p => ({
  title: p.title,
  tagline: p.tagline,
  desc: p.desc,
  tags: p.tags,
  src: p.image,
  href: p.href,
}));

const Projects = () => (
  <section id="projects" className="border-t border-white/5">
    <div className="py-12 px-6 max-w-4xl mx-auto flex items-end justify-between">
      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Selected Projects</h2>
      <a
        href="https://github.com/Ansh3878"
        className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-medium font-mono uppercase tracking-widest group"
      >
        View All
        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
    <StickyScrollCards cards={STICKY_CARDS} hint="scroll to explore projects" />
  </section>
);


const Footer = () => (
  <footer className="pt-16 pb-0 px-6 max-w-4xl mx-auto border-t border-white/5 flex flex-col items-center">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center w-full"
    >

      <div className="flex justify-center items-center gap-2">
        <a
          href="https://github.com/Ansh3878"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-xs font-medium uppercase tracking-widest px-4 py-2"
        >
          <Github className="w-4 h-4" />
          Github
        </a>
        <span className="text-zinc-700 text-lg leading-none">·</span>
        <a
          href="https://www.linkedin.com/in/anshul-sharma-38999b251"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-xs font-medium uppercase tracking-widest px-4 py-2"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
        <span className="text-zinc-700 text-lg leading-none">·</span>
        <a
          href="mailto:ansh1143@outlook.com"
          className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-xs font-medium uppercase tracking-widest px-4 py-2"
        >
          <Mail className="w-4 h-4" />
          Contact
        </a>
      </div>

      <div className="pt-12 relative overflow-hidden pointer-events-none select-none">
        <div className="text-[15vw] font-bold text-white/[0.02] whitespace-nowrap mask-footer tracking-tighter uppercase leading-none">
          anshul
        </div>
        <p className="text-center text-[10px] text-zinc-800 uppercase tracking-[0.5em] pb-8">
          © 2026 Crafted with Passion & Precision
        </p>
      </div>
    </motion.div>
  </footer>
);

const EDUCATION_ITEMS = [
  {
    period: "2022 — 2026",
    institution: "Manav Rachna International Institute of Research and Studies",
    location: "Faridabad, India",
    degree: "B.Tech in Computer Science",
    result: "7.5 CGPA",
  },
  {
    period: "2021",
    institution: "KD Public School",
    location: "Faridabad, India",
    degree: "Class XII",
    result: "93%",
  },
  {
    period: "2019",
    institution: "KD Public School",
    location: "Faridabad, India",
    degree: "Class X",
    result: "79%",
  },
];

const Education = () => (
  <section
    id="education"
    className="mx-auto max-w-4xl border-t border-white/5 px-6 py-24"
  >
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <h2 className="text-4xl font-black uppercase tracking-tighter text-white md:text-5xl">
        Education
      </h2>
    </motion.div>

    <div className="mt-12 space-y-3">
      {EDUCATION_ITEMS.map((edu, index) => (
        <motion.article
          key={`${edu.institution}-${edu.period}`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="group relative -mx-4 overflow-hidden rounded-2xl px-4"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.035] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-5 py-8 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-start md:gap-x-6 md:py-9">
            <motion.div variants={staggerItem} className="flex items-center gap-2 pt-1">
              <span className="font-mono text-[10px] text-zinc-700 transition-colors duration-300 group-hover:text-zinc-400">
                0{index + 1}
              </span>
              <span className="h-px w-2 bg-zinc-800 transition-all duration-500 group-hover:w-5 group-hover:bg-zinc-500" />
            </motion.div>

            <motion.div variants={staggerContainer} className="min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-1">
              <motion.h3 variants={staggerItem} className="text-lg font-semibold leading-snug tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-white md:text-xl">
                {edu.institution}
              </motion.h3>
              <motion.p variants={staggerItem} className="mt-3 text-sm leading-6 text-zinc-500 md:text-base">
                {edu.degree}
                <span className="mx-2 text-zinc-700">/</span>
                <span className="font-medium text-zinc-300">{edu.result}</span>
              </motion.p>
            </motion.div>

            <motion.div variants={staggerItem} className="col-start-2 flex items-center gap-3 md:col-start-3 md:row-start-1 md:flex-col md:items-end md:gap-2">
              <span className="whitespace-nowrap rounded-full border border-white/[0.08] px-3 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-zinc-300 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white">
                {edu.period}
              </span>
              <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-700 transition-colors duration-300 group-hover:text-zinc-500">
                {edu.location}
              </span>
            </motion.div>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      <SmoothCursor />
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}

      <main className="relative isolate min-h-screen bg-neutral-950 selection:bg-brand-green/20 selection:text-white">
        <div className="fixed inset-0 -z-10">
          {/* <NoiseTexture className="fixed inset-0 size-full opacity-40" /> */}
          <LightRays className="fixed inset-0 size-full " />
        </div>

        <Navbar onOpen={() => setMenuOpen(true)} />
        <ScrollProgressBar />
        <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <Hero isVisible={!showLoader} />
        <ScrollSplitSection />
        <About />
        <Education />
        <Stacks />
        <Experience />
        <Projects />
        <CallToAction />
        <Footer />
      </main>
    </>
  );
}
