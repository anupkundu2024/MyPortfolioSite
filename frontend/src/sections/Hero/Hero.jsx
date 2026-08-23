import { motion } from "framer-motion";
import { ArrowDown, ExternalLink, Github, Linkedin, Briefcase, Mail, Sparkles, Terminal } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { ParticleBackground } from "./ParticleBackground";
import { RotatingBadge } from "./RotatingBadge";

export function Hero() {
  const scrollToProjects = () => {
    const element = document.getElementById("work");
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12"
      aria-label="Introduction and Developer Summary"
    >
      {/* 3D Particle Canvas Background */}
      <ParticleBackground />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern-fine pointer-events-none opacity-40 -z-10" />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column - Core Identity & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Availability Indicator */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>OPEN TO SWE INTERNSHIPS & JUNIOR ROLES</span>
              </motion.div>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <span>Final-Year B.Tech CSE</span>
              </span>
            </div>

            {/* Main Identity Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                ANUP <span className="text-gradient">KUNDU</span>
              </h1>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm sm:text-base font-semibold tracking-wider">
                  <Terminal className="w-4 h-4" />
                  <span className="min-w-[200px] text-left">
                    <Typewriter
                      words={[
                        "Full Stack Developer",
                        "MERN Stack Engineer",
                        "React & Node.js Developer",
                        "Frontend & Backend Builder",
                      ]}
                      loop={0}
                      cursor
                      cursorStyle="|"
                      typeSpeed={60}
                      deleteSpeed={40}
                      delaySpeed={1800}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Recruiter-friendly bio */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Final-Year B.Tech Computer Science & Engineering student building practical full-stack web applications and exploring AI-assisted development.
            </p>

            {/* Tech Stack Scannable Badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1 text-xs text-muted-foreground/80">
              <span className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border/50 font-medium">React.js</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border/50 font-medium">Node.js</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border/50 font-medium">Express.js</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border/50 font-medium">MongoDB</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border/50 font-medium">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border/50 font-medium">AI Tools & REST APIs</span>
            </div>

            {/* Action CTAs & Direct Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3"
            >
              {/* Primary CTA: View Projects */}
              <button
                onClick={scrollToProjects}
                className="btn-hero flex items-center gap-2 text-sm sm:text-base font-semibold px-6 sm:px-8 py-3.5 cursor-pointer"
                aria-label="View Projects Section"
              >
                <Briefcase className="w-4 h-4" />
                <span>View Projects</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  ↓
                </span>
              </button>

              {/* Secondary CTA: Get In Touch */}
              <button
                onClick={scrollToContact}
                className="flex items-center gap-2 text-sm sm:text-base font-medium px-6 py-3.5 rounded-[var(--radius)] bg-secondary/70 hover:bg-secondary border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-200 cursor-pointer"
                aria-label="Contact Anup Kundu"
              >
                <Mail className="w-4 h-4" />
                <span>Get In Touch</span>
              </button>

              {/* Quick Profile Links */}
              <div className="flex items-center gap-2 pl-1">
                <a
                  href="https://github.com/anupkundu2024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-effect border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200"
                  aria-label="Anup Kundu's GitHub profile (opens in a new tab)"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/anupkundu-linkdin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-effect border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200"
                  aria-label="Anup Kundu's LinkedIn profile (opens in a new tab)"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Profile Photo with Rotating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            <div className="relative max-w-sm sm:max-w-md w-full group">
              {/* Ambient backglow */}
              <div
                aria-hidden="true"
                className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition duration-700 -z-10"
              />

              <div className="relative rounded-2xl overflow-hidden border border-border/50 glass-effect shadow-2xl">
                <img
                  src="https://i.postimg.cc/fyCnLbKz/IMG-20250829-WA0104-2.jpg"
                  alt="Anup Kundu - Full Stack Software Developer Profile Photo"
                  loading="eager"
                  className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Rotating Badge on profile corner */}
              <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-4 z-20">
                <RotatingBadge size={120} />
              </div>

              {/* Floating tech badge */}
              <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-4 bg-background/90 border border-primary/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-spin-slow" />
                <span>MERN Developer</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Bottom Scroll Indicator */}
      <button
        onClick={scrollToProjects}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer focus:outline-none"
        aria-label="Scroll to Projects Section"
      >
        <span className="text-[11px] font-mono tracking-widest uppercase">EXPLORE</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
