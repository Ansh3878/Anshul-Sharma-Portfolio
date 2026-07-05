/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

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
  Mail
} from "lucide-react";

import { LightRays } from "@/src/components/ui/light-rays.js"
import AnimatedButton from "@/src/components/AnimatedButton"
import { ScrollProgressBar } from "@/src/components/ScrollProgressBar"
import { SmoothCursor } from "@/src/components/SmoothCursor"
import ProjectShowcase from "@/src/components/ProjectShowcase"
import LogoLoop from "@/src/components/ui/logo-loop"

// --- Components ---


const Navbar = ({ onOpen }: { onOpen: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/50 backdrop-blur-md border-b border-white/5">
    <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-white font-signature text-3xl font-bold tracking-wider hover:scale-105 transition-transform cursor-pointer"
      >
        AS
      </div>
      <button
        onClick={onOpen}
        className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
      >
        <Menu className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
      </button>
    </div>
  </nav>
);

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

const Hero = () => (
  <section
    id="hero"
    className="relative min-h-screen w-full flex flex-col justify-between px-6 md:px-12 pt-28 pb-12 overflow-hidden"
  >


    {/* Center Typography (Name) */}
    <div className="flex-1 flex flex-col justify-center items-center w-full">
      <div className="relative">
        {/* Script Annotation above the text (equivalent to "niche targeting") */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: -10 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute font-signature text-zinc-400 select-none text-left pointer-events-none hero-annotation"
          style={{
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            lineHeight: "0.95"
          }}
        >
          secure<br />coder
        </motion.div>

        {/* Main typographic line */}
        <h1
          className="flex items-baseline justify-center select-none text-white tracking-tighter leading-none"
          style={{ fontFamily: "var(--font-outfit)", fontWeight: 300 }}
        >
        {/* Lowercase 'a' */}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-white"
          style={{ fontSize: "clamp(80px, 16vw, 195px)", lineHeight: "0.85" }}
        >
          a
        </motion.span>

        {/* 'nshul' */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-white"
          style={{ fontSize: "clamp(54px, 11vw, 130px)" }}
        >
          nshul
        </motion.span>

        {/* Script 'w' (superscript style) */}
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-signature text-zinc-400 mx-[0.4vw] select-none relative"
          style={{
            fontSize: "clamp(24px, 5vw, 55px)",
            top: "-0.95em"
          }}
        >
          w
        </motion.span>

        {/* Lowercase 's' */}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-white"
          style={{ fontSize: "clamp(80px, 16vw, 195px)", lineHeight: "0.85" }}
        >
          s
        </motion.span>

        {/* 'harma' */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-white flex items-baseline"
          style={{ fontSize: "clamp(54px, 11vw, 130px)" }}
        >
          harma
          <span className="text-white ml-1 inline-block rounded-full bg-white w-[1.2vw] h-[1.2vw] min-w-[6px] min-h-[6px]" />
        </motion.span>
      </h1>
    </div>
  </div>

    {/* Bottom Section */}
    <div className="w-full flex flex-col md:flex-row justify-between items-start gap-8 pt-8 border-t border-white/5">
      {/* Left Column: Tagline + Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex flex-col items-start gap-6 max-w-lg"
      >
        <p className="font-signature text-zinc-400 text-2xl md:text-3xl tracking-wide">
          react — next.js — python — AI — cybersecurity
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-start">
          <AnimatedButton
            label="View Resume"
            href="https://drive.google.com/file/d/1aXdUiuedu5qcfvQK974La_vbCfEVW09Q/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </motion.div>

      {/* Right Column: Bio paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-md text-left"
      >
        <p className="text-sm text-zinc-400 leading-relaxed">
          independent full-stack developer &amp; cybersecurity enthusiast based in India, helping teams build secure, high-performance web systems and modern architectural patterns.
        </p>
      </motion.div>
    </div>
  </section>
);

const About = () => (
  <motion.section
    id="about"
    className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5"
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
  >
    <div className="grid md:grid-cols-2 gap-12 text-left items-start">
      <motion.div variants={fadeLeft}>
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 mb-8 font-mono">About Me</h2>
      </motion.div>
      <motion.div variants={staggerContainer} className="space-y-6">
        <motion.p variants={staggerItem} className="text-zinc-400 leading-relaxed text-lg">
          As a recent B.Tech graduate in Computer Science, I've developed a profound interest in bridging the gap between robust AI integrations and secure, high-performance infrastructure. My journey is fueled by a relentless curiosity for how systems interact and a commitment to writing clean, maintainable code.
        </motion.p>
        <motion.p variants={staggerItem} className="text-zinc-400 leading-relaxed text-lg">
          Whether it's architecting a full-stack application with Next.js or deep-diving into network security vulnerabilities, I approach every project with a user-centric mindset and an obsession for detail. Performance, security, and elegance are the three pillars of my work.
        </motion.p>
        <motion.div variants={staggerItem} className="pt-4">
          <div className="font-signature text-4xl text-white opacity-80 select-none">Anshul Sharma</div>
          <p className="text-zinc-600 text-sm mt-2 font-mono">Founder & Lead Engineer Of @ Matrix AI</p>
        </motion.div>
      </motion.div>
    </div>
  </motion.section>
);

const Achievements = () => (
  <section className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
    <div className="text-white grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        { label: "Projects Completed", value: "25+" },
        { label: "Technologies Mastered", value: "15+" },
        { label: "Coffees Consumed", value: "500+" }
      ].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="flex flex-col gap-2"
        >
          <span className="text-5xl font-bold font-mono">{stat.value}</span>
          <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  </section>
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

const techLogos1 = ALL_TECH.map((stack) => ({
  node: (
    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full hover:bg-white/[0.05] transition-all group cursor-none">
      <stack.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
      <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{stack.name}</span>
    </div>
  )
}));

const techLogos2 = [...ALL_TECH].reverse().map((stack) => ({
  node: (
    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full hover:bg-white/[0.05] transition-all group cursor-none">
      <stack.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
      <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{stack.name}</span>
    </div>
  )
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
        className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono"
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

const Experience = () => (
  <motion.section
    id="experience"
    className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5"
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
  >
    <div className="space-y-16">
      <motion.h2
        variants={fadeUp}
        className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono"
      >
        Experience
      </motion.h2>
      <div className="relative pl-8 border-l border-white/10 space-y-20">
        {[
          {
            period: "MAY 2024 - JUNE 2024",
            role: "Frontend Development Intern",
            company: "IBM",
            description: "Built responsive, high-performance web applications using React.js. Collaborated in agile teams to integrate APIs and deliver accessible UI components.",
            skills: ["React.js", "API Integration", "Agile", "UI/UX"]
          },
          {
            period: "JUNE 2024 - AUGUST 2024",
            role: "Web Development Intern",
            company: "Next24tech",
            description: "Developed and deployed 5+ responsive web projects. Designed interactive UI components and optimized performance in agile environments.",
            skills: ["Next.js", "Tailwind", "JavaScript", "Optimization"]
          },
        ].map((exp, i) => (
          <motion.div
            key={i}
            variants={fadeLeft}
            custom={i * 0.08}
            className="relative"
          >
            <div className="absolute -left-[40px] top-1.5 h-4 w-4 rounded-full bg-neutral-950 border-2 border-white/20" />
            <motion.div className="space-y-4" variants={staggerContainer}>
              <motion.span variants={staggerItem} className="text-zinc-600 font-mono text-xs tracking-widest">{exp.period}</motion.span>
              <motion.div variants={staggerItem} className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-white">{exp.role} @ <span className="text-zinc-400">{exp.company}</span></h3>
              </motion.div>
              <motion.p variants={staggerItem} className="text-zinc-400 leading-relaxed max-w-xl">
                {exp.description}
              </motion.p>
              <motion.div variants={staggerItem} className="flex flex-wrap gap-2 pt-2">
                {exp.skills.map((skill, si) => (
                  <span key={si} className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

const PROJECTS = [
  {
    title: "Keepr",
    tagline: "Zero-Knowledge Security Suite",
    desc: "A client-side encrypted workspace for secure file sharing, persistent storage vaults with dead-man switches, and ephemeral WebSocket chat.",
    tags: ["React", "AWS Serverless", "Web Crypto", "Clerk"],
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1400",
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

const Projects = () => (
  <section id="projects" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono">Selected Projects</h2>
        <a
          href="https://github.com/Ansh3878"
          className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-medium font-mono uppercase tracking-widest group"
        >
          View All
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
      <ProjectShowcase projects={PROJECTS} />
    </div>
  </section>
);


const Footer = () => (
  <footer className="pt-24 pb-8 px-6 max-w-4xl mx-auto border-t border-white/5 flex flex-col items-center">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center space-y-12 w-full"
    >
      <div className="space-y-4">
        <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tighter">Let's build something epic.</h2>
        <a
          href="mailto:ansh1143@outlook.com"
          className="text-zinc-400 hover:text-white transition-colors text-xl font-mono"
        >
          ansh1143@outlook.com
        </a>
      </div>

      <div className="flex justify-center gap-8 items-center pt-8">
        <a
          href="https://github.com/Ansh3878"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
        >
          <Github className="w-5 h-5" />
          Github
        </a>
        <a
          href="https://www.linkedin.com/in/anshul-sharma-38999b251"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
        >
          <Linkedin className="w-5 h-5" />
          LinkedIn
        </a>
        <a
          href="mailto:ansh1143@outlook.com"
          className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
        >
          <Mail className="w-5 h-5" />
          Contact
        </a>
      </div>

      <div className="pt-24 relative overflow-hidden pointer-events-none select-none">
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

const Education = () => (
  <motion.section
    id="education"
    className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5"
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
  >
    <div className="space-y-16">
      <motion.h2
        variants={fadeUp}
        className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono"
      >
        Education
      </motion.h2>
      <div className="relative pl-8 border-l border-white/10 space-y-16">
        {[
          {
            period: "2022 - 2026",
            institution: "Manav Rachna International Institute of Research and Studies",
            location: "Faridabad, India",
            degree: "Bachelor of Technology in Computer Science",
            result: "7.45 CGPA"
          },
          {
            period: "2021",
            institution: "KD Public School",
            location: "Faridabad, India",
            degree: "Class XII",
            result: "93%"
          },
          {
            period: "2019",
            institution: "KD Public School",
            location: "Faridabad, India",
            degree: "Class X",
            result: "79%"
          }
        ].map((edu, i) => (
          <motion.div
            key={i}
            variants={fadeLeft}
            custom={i * 0.08}
            className="relative"
          >
            <div className="absolute -left-[40px] top-1.5 h-4 w-4 rounded-full bg-neutral-950 border-2 border-white/20" />
            <motion.div
              className="flex flex-col md:flex-row md:items-start justify-between gap-4"
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem} className="space-y-2">
                <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                <p className="text-zinc-400 font-medium italic">
                  {edu.degree}: <span className="text-white not-italic font-bold">{edu.result}</span>
                </p>
              </motion.div>
              <motion.div variants={staggerItem} className="text-left md:text-right">
                <p className="text-white font-mono text-xs font-bold tracking-widest">{edu.period}</p>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-1">{edu.location}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative isolate min-h-screen bg-neutral-950 overflow-x-hidden selection:bg-brand-green/20 selection:text-white">
      <SmoothCursor />
      <div className="fixed inset-0 -z-10">
        {/* <NoiseTexture className="fixed inset-0 size-full opacity-40" /> */}
        <LightRays className="fixed inset-0 size-full " />
      </div>

      <Navbar onOpen={() => setMenuOpen(true)} />
      <ScrollProgressBar />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Hero />
      <Achievements />
      <About />
      <Education />
      <Stacks />
      <Experience />
      <Projects />
      <Footer />
    </main>
  );
}
