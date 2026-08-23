import { motion } from "framer-motion";
import { Sparkles, Layout, Server, Database, Wrench, Bot } from "lucide-react";

export function SkillsSystem() {
  const aiTools = [
    { name: "Cursor", icon: "⚡", role: "AI-Powered IDE" },
    { name: "GitHub Copilot", icon: "🤖", role: "Code Assistance" },
    { name: "Claude", icon: "🧠", role: "Architecture & Logic" },
    { name: "ChatGPT", icon: "💬", role: "Debugging & Ideation" },
    { name: "Gemini", icon: "✨", role: "Research & Documentation" },
    { name: "n8n", icon: "🔄", role: "Workflow Automation" },
  ];

  const skillCategories = [
    {
      title: "Frontend Architecture",
      icon: <Layout className="w-5 h-5 text-primary" />,
      description: "Building responsive, accessible, and high-performance client-side web applications.",
      skills: [
        { name: "React 18", icon: "⚛️", focus: "Core Library" },
        { name: "JavaScript (ES6+)", icon: "⚡", focus: "Language Core" },
        { name: "Tailwind CSS", icon: "💨", focus: "UI Styling" },
        { name: "HTML5 & Semantic UI", icon: "🌐", focus: "Accessibility" },
        { name: "CSS3 & Motion", icon: "🎨", focus: "Animations & Layout" },
        { name: "Vite Tooling", icon: "⚡", focus: "Build Tool" },
      ],
    },
    {
      title: "Backend & REST APIs",
      icon: <Server className="w-5 h-5 text-accent" />,
      description: "Designing modular server architectures and robust RESTful API endpoints.",
      skills: [
        { name: "Node.js", icon: "🟢", focus: "Runtime Environment" },
        { name: "Express.js", icon: "🚂", focus: "Server Framework" },
        { name: "RESTful API Design", icon: "🔌", focus: "API Architecture" },
        { name: "Clerk Authentication", icon: "🔐", focus: "Auth & Sessions" },
        { name: "Middleware & JWT", icon: "🛡️", focus: "Security & Guards" },
        { name: "MVC Architecture", icon: "🏗️", focus: "Design Pattern" },
      ],
    },
    {
      title: "Databases & Cloud",
      icon: <Database className="w-5 h-5 text-purple-400" />,
      description: "Managing data schemas, query optimization, and automated cloud deployments.",
      skills: [
        { name: "MongoDB", icon: "🍃", focus: "NoSQL Database" },
        { name: "Mongoose ODM", icon: "📦", focus: "Data Modeling" },
        { name: "MySQL", icon: "🛢️", focus: "Relational DB" },
        { name: "Vercel", icon: "▲", focus: "Frontend Cloud" },
        { name: "Netlify", icon: "🌐", focus: "Web Hosting" },
        { name: "Render Cloud", icon: "🚀", focus: "Backend Services" },
      ],
    },
    {
      title: "Tools & Developer Ecosystem",
      icon: <Wrench className="w-5 h-5 text-emerald-400" />,
      description: "Version control, testing suites, UI design tools, and developer utilities.",
      skills: [
        { name: "Git & GitHub", icon: "🐙", focus: "Version Control" },
        { name: "Three.js / 3D Canvas", icon: "🧊", focus: "3D Graphics" },
        { name: "Postman", icon: "📮", focus: "API Testing" },
        { name: "Figma", icon: "🎯", focus: "UI Prototyping" },
        { name: "Framer Motion", icon: "✨", focus: "Fluid Animations" },
        { name: "VS Code", icon: "💻", focus: "Development" },
      ],
    },
  ];

  // Flat list for continuous marquee ticker
  const marqueeSkills = [
    { name: "React 18", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Express.js", icon: "🚂" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Cursor AI", icon: "⚡" },
    { name: "GitHub Copilot", icon: "🤖" },
    { name: "Claude", icon: "🧠" },
    { name: "ChatGPT", icon: "💬" },
    { name: "JavaScript ES6+", icon: "⚡" },
    { name: "Tailwind CSS", icon: "💨" },
    { name: "REST APIs", icon: "🔌" },
    { name: "Three.js", icon: "🧊" },
    { name: "Clerk Auth", icon: "🔐" },
    { name: "Git & GitHub", icon: "🐙" },
    { name: "n8n", icon: "🔄" },
  ];

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 relative overflow-hidden"
      aria-label="Skills and Technology System Section"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Skills & Technology <span className="text-gradient">Stack</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A comprehensive, modern stack for full-stack web applications, clean architecture, and AI-accelerated workflows.
          </p>
        </motion.div>

        {/* Marquee Technology Ticker */}
        <div className="relative w-full overflow-hidden py-3.5 mb-10 marquee-container border-y border-border/40 bg-secondary/30 backdrop-blur-md">
          {/* Gradient Edge Masks for soft fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-6 select-none">
            {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-background/80 border border-border/60 hover:border-primary/50 text-foreground text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap shadow-sm"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tools & Workflow Spotlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="glass-effect p-6 sm:p-8 rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] mb-8 relative overflow-hidden group hover:border-primary/50 transition-all duration-300"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-primary/15 border border-primary/30 text-primary">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    AI Tools & Workflow
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-primary/15 text-primary border border-primary/30 rounded-full uppercase">
                    Workflow Accelerator
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Using modern AI tools to accelerate coding, debugging, research, documentation, prototyping and workflow automation.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground/80 font-mono bg-secondary/60 px-3 py-1.5 rounded-lg border border-border/50">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Full-Stack + AI Workflow</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {aiTools.map((tool) => (
              <div
                key={tool.name}
                className="p-3.5 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/40 hover:bg-secondary/80 transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div>
                  <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground/70 uppercase mt-0.5">
                    {tool.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4 Categorized Domains Matrix */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {skillCategories.map((category, catIdx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: catIdx * 0.1, duration: 0.6 }}
              className="glass-effect p-6 sm:p-8 rounded-2xl border border-border/40 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-secondary/80 border border-border/60">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl bg-secondary/60 border border-border/50 hover:border-primary/40 hover:bg-secondary/90 transition-all duration-200 group flex flex-col justify-between"
                    >
                      <div className="text-2xl mb-1.5">{skill.icon}</div>
                      <div>
                        <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {skill.name}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/70 uppercase">
                          {skill.focus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSystem;
