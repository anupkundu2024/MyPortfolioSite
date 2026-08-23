import { motion } from "framer-motion";
import {
  Code2,
  Layers,
  Cpu,
  Compass,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Sparkles,
  Server,
  Database,
  Wrench,
  Layout,
} from "lucide-react";

export function About() {
  const pillars = [
    {
      icon: <Layers className="w-6 h-6 text-primary" />,
      title: "Full-Stack Engineering",
      description:
        "Building end-to-end web applications with React, Node.js, Express, and MongoDB. Focused on clean REST APIs, secure authentication, and modular architecture.",
    },
    {
      icon: <Code2 className="w-6 h-6 text-accent" />,
      title: "Modern UI / UX",
      description:
        "Crafting responsive user interfaces using Tailwind CSS, Framer Motion, and Three.js with clean typography and mobile-first design principles.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: "AI & Workflow Acceleration",
      description:
        "Using modern AI tools (Cursor, Copilot, Claude, ChatGPT) to accelerate coding, debugging, documentation, and cloud deployments on Vercel, Netlify, and Render.",
    },
    {
      icon: <Compass className="w-6 h-6 text-emerald-400" />,
      title: "CS Foundations",
      description:
        "Strong foundation in Data Structures, Algorithms, Object-Oriented Programming, relational databases (MySQL), and Git version control.",
    },
  ];

  const skillGroups = [
    {
      category: "Frontend",
      icon: <Layout className="w-4 h-4 text-primary" />,
      skills: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 & CSS3", "Vite", "Material UI"],
    },
    {
      category: "Backend & APIs",
      icon: <Server className="w-4 h-4 text-accent" />,
      skills: ["Node.js", "Express.js", "RESTful APIs", "JWT Auth", "MVC Architecture"],
    },
    {
      category: "Databases & Cloud",
      icon: <Database className="w-4 h-4 text-purple-400" />,
      skills: ["MongoDB", "Mongoose ODM", "MySQL", "Vercel", "Netlify", "Render"],
    },
    {
      category: "Tools & AI Workflows",
      icon: <Wrench className="w-4 h-4 text-emerald-400" />,
      skills: ["Git & GitHub", "Cursor", "GitHub Copilot", "Postman", "Figma", "Three.js"],
    },
  ];

  const highlights = [
    "Final-Year B.Tech Computer Science & Engineering student",
    "Hands-on experience engineering full-stack MERN web applications",
    "Focus on responsive design, REST APIs, and clean code architecture",
    "Comfortable using modern AI tools to accelerate development and debugging",
    "Actively seeking Software Engineering Internships & Junior Roles",
  ];

  return (
    <section
      id="about"
      className="py-16 sm:py-20 relative overflow-hidden"
      aria-label="About Me Section"
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile & Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            About <span className="text-gradient">Anup Kundu</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Full-Stack Developer and Final-Year Computer Science & Engineering student focused on building reliable web applications with the MERN stack and AI-assisted workflows.
          </p>
        </motion.div>

        {/* Narrative & Highlights Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Main Story Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 glass-effect p-8 sm:p-10 rounded-2xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h3 className="text-2xl font-bold text-foreground">
                  My Background
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border/50">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Kolkata, India</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                I am a final-year <strong className="text-foreground font-semibold">Computer Science & Engineering student</strong> and <strong className="text-foreground font-semibold">Full Stack Developer</strong> specializing in the MERN stack (MongoDB, Express.js, React, Node.js) and modern web architectures.
              </p>

              <p className="text-muted-foreground leading-relaxed text-base">
                I build practical web applications that solve real-world problems. From engineering equity trading simulations like <span className="text-primary font-medium">KunduStocks</span> and accommodation platforms like <span className="text-primary font-medium">Wanderlust</span> to expense management systems like <span className="text-primary font-medium">AKExpenses</span>, I emphasize modular backend architecture, clean state management, and responsive user experiences.
              </p>

              <div className="pt-2 space-y-3" aria-label="Key background highlights">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-border/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>Final-Year B.Tech CSE</span>
              </div>
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for Hire</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Metrics (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-4 justify-between"
          >
            {/* Stat Box 1 */}
            <div className="glass-effect p-6 rounded-2xl border border-primary/20 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-gradient">4+</span>
                  <h4 className="text-base font-bold text-foreground mt-1">Full-Stack Projects</h4>
                  <p className="text-xs text-muted-foreground mt-1">Built with MERN, authentication, and live cloud deployment.</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Stat Box 2 */}
            <div className="glass-effect p-6 rounded-2xl border border-border/40 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">15+</span>
                  <h4 className="text-base font-bold text-foreground mt-1">Technologies & Tools</h4>
                  <p className="text-xs text-muted-foreground mt-1">React, Node.js, Express, MongoDB, MySQL, Tailwind CSS & Git.</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Stat Box 3 */}
            <div className="glass-effect p-6 rounded-2xl border border-border/40 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">Final</span>
                  <h4 className="text-base font-bold text-foreground mt-1">Year B.Tech CSE</h4>
                  <p className="text-xs text-muted-foreground mt-1">Core computer science curriculum, algorithms, and practical software engineering.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technical Skills Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Technical <span className="text-gradient">Skills</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillGroups.map((group) => (
              <div
                key={group.category}
                className="glass-effect p-6 rounded-2xl border border-border/40 hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border/30">
                  <div className="p-2 rounded-lg bg-secondary/80">
                    {group.icon}
                  </div>
                  <h4 className="text-base font-bold text-foreground">
                    {group.category}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs rounded-lg bg-secondary/70 border border-border/50 text-foreground/90 font-medium hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4 Core Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-effect p-6 rounded-2xl border border-border/40 hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-secondary/80 inline-block mb-4 group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {pillar.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
