/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowUpRight, 
  Menu, 
  X,
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  GitBranch,
  Cloud,
  FileCode,
  Terminal,
  FileBadge,
  Monitor,
  Binary,
  Brackets
} from "lucide-react";

import { LightRays } from "@/src/components/ui/light-rays.js"
import { DiaTextReveal } from "@/src/components/ui/dia-text-reveal.js"
import { MorphingText } from "@/src/components/ui/morphing-text.js" 

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
  <section id="hero" className="pt-40 pb-24 px-6 max-w-4xl mx-auto">


    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
        </div>
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium font-mono">
          Open to work
        </span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-2xl leading-[1.1]">
      <MorphingText className="text-sx text-justify" texts={["Hello", "नमस्ते", "やあ", "Salut", "Hola"]} /> I'm <span className="text-white">
      <DiaTextReveal text="Anshul" textColor="#ffffff" colors={["#3A6073", "#39596A", "#385261"]}/>   <DiaTextReveal text="Sharma" textColor="#ffffff" colors={["#3A6073", "#39596A", "#385261"]}/>
       </span>, Full-Stack Developer & <span className="inline-flex">Cybersecurity Intern.</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-zinc-400 max-w-xl leading-relaxed">
        Transforming complex problems into elegant, secure, and scalable solutions.
      </p>
       <a href="https://drive.google.com/file/d/1aXdUiuedu5qcfvQK974La_vbCfEVW09Q/view?usp=sharing">
      <button className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2">
        View Resume
        <ArrowUpRight className="w-5 h-5" />
      </button>
      </a>
    </motion.div>
  </section>
);

const About = () => (
  <section id="about" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
    <div className="grid md:grid-cols-2 gap-12 text-left items-start">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 mb-8 font-mono">About Me</h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        <p className="text-zinc-400 leading-relaxed text-lg">
          Currently pursuing my B.Tech in Computer Science, I've developed a profound interest in bridging the gap between robust AI integrations and secure, high-performance infrastructure. My journey is fueled by a relentless curiosity for how systems interact and a commitment to writing clean, maintainable code.
        </p>
        <p className="text-zinc-400 leading-relaxed text-lg">
          Whether it's architecting a full-stack application with Next.js or deep-diving into network security vulnerabilities, I approach every project with a user-centric mindset and an obsession for detail. Performance, security, and elegance are the three pillars of my work.
        </p>
        <div className="pt-4">
          <div className="font-signature text-4xl text-white opacity-80 select-none">Anshul Sharma</div>
          <p className="text-zinc-600 text-sm mt-2 font-mono">Founder & Lead Engineer Of @ Matrix AI</p>
        </div>
      </motion.div>
    </div>
  </section>
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

const Stacks = () => (
  <section className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
    <div className="space-y-12">
      <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono">Current Stack</h2>
      <div className="flex flex-wrap gap-4 md:gap-6">
        {[
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
        ].map((stack, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full hover:bg-white/[0.05] transition-all group cursor-default"
          >
            <stack.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{stack.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Experience = () => (
  <section id="experience" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
    <div className="space-y-16">
      <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono">Experience</h2>
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
          {
            period: "2024 - PRESENT",
            role: "Cybersecurity Intern",
            company: "SO Infotech Pvt Ltd",
            description: "Conducting vulnerability assessments across enterprise network architectures. Implementing security protocols and monitoring systems for real-time threat detection.",
            skills: ["Network Security", "Penetration Testing", "Python", "Linux"]
          },
        ].map((exp, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-[40px] top-1.5 h-4 w-4 rounded-full bg-neutral-950 border-2 border-white/20" />
            <div className="space-y-4">
              <span className="text-zinc-600 font-mono text-xs tracking-widest">{exp.period}</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-white">{exp.role} @ <span className="text-zinc-400">{exp.company}</span></h3>
              </div>
              <p className="text-zinc-400 leading-relaxed max-w-xl">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {exp.skills.map((skill, si) => (
                  <span key={si} className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Projects = () => (
  <section id="projects" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
    <div className="space-y-16">
      <div className="flex items-end justify-between">
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono">Selected Projects</h2>
        <a href="https://github.com/Ansh3878" className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-medium font-mono uppercase tracking-widest group">
          View All Projects
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
      
      <div className="text-white grid md:grid-cols-2 gap-8">
        {[
          {
            title: "Matrix AI",
            tagline: "Career Companion",
            desc: "A modern workspace utilizing Gemini AI to transform how professionals manage their career growth and technical skill acquisition.",
            tags: ["Next.js", "Gemini API", "Tailwind"],
            image: "/src/img/matrix-image.png",
            href: "https://matrix-ai-psi.vercel.app/",
          },

          {
            title: "CropDoc",
            tagline: "AI Agricultural Platform",
            desc: "An AI-powered platform for real-time crop disease detection using computer vision to provide actionable treatment recommendations for farmers.",
            tags: ["Next.js", "PostgreSQL", "OpenAI", "ML"],
            image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1000",
            href: "https://crop-doc-rho.vercel.app/"
          }
        ].map((project, i) => (
          <motion.a
            key={i}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group block space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="aspect-[16/10] overflow-hidden rounded-xl relative">
              <img 
                src={project.image} 
                alt={project.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">Live</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
                <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag, ti) => (
                  <span key={ti} className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
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
  <section id="education" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
    <div className="space-y-16">
      <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-600 font-mono">Education</h2>
      <div className="relative pl-8 border-l border-white/10 space-y-16">
        {[
          {
            period: "2022 - PRESENT",
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
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-[40px] top-1.5 h-4 w-4 rounded-full bg-neutral-950 border-2 border-white/20" />
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                <p className="text-zinc-400 font-medium italic">
                  {edu.degree}: <span className="text-white not-italic font-bold">{edu.result}</span>
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-white font-mono text-xs font-bold tracking-widest">{edu.period}</p>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-1">{edu.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative isolate min-h-screen bg-neutral-950 overflow-x-hidden selection:bg-brand-green/20 selection:text-white">
      <div className="fixed inset-0 -z-10">
        {/* <NoiseTexture className="fixed inset-0 size-full opacity-40" /> */}
        <LightRays className="fixed inset-0 size-full " />
      </div>

      <Navbar onOpen={() => setMenuOpen(true)} />
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
