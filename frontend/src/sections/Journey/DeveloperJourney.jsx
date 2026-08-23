import { motion } from "framer-motion";
import { GraduationCap, Code2, Bot, Rocket, Sparkles, CheckCircle2 } from "lucide-react";

export function DeveloperJourney() {
  const milestones = [
    {
      year: "Phase 1 • Foundations",
      title: "Computer Science Foundations",
      role: "Academic Foundations (CSE)",
      icon: <GraduationCap className="w-5 h-5 text-primary" />,
      description:
        "Building core engineering fundamentals: Data Structures, Algorithms, Object-Oriented Programming, Database Management Systems, and Computer Networks.",
      takeaways: [
        "Strong problem-solving mindset & algorithmic logic",
        "Deep understanding of relational & non-relational database principles",
        "Collaborative development & version control with Git",
      ],
      current: false,
    },
    {
      year: "Phase 2 • Full-Stack Development",
      title: "MERN Stack Applications",
      role: "Full-Stack Engineering",
      icon: <Code2 className="w-5 h-5 text-accent" />,
      description:
        "Engineered real-world web applications: built trading platform (KunduStocks), accommodation portal (Wanderlust), and expense manager (AKExpenses).",
      takeaways: [
        "End-to-end REST API design with Express and Node.js",
        "Modern frontend state, routing, and UI design with React & Tailwind CSS",
        "Secure authentication flows with Clerk and JWT",
      ],
      current: false,
    },
    {
      year: "Phase 3 • AI Tools & Cloud",
      title: "AI-Assisted Development & Cloud",
      role: "Modern Engineering Workflow",
      icon: <Bot className="w-5 h-5 text-purple-400" />,
      description:
        "Integrating modern AI tools (Cursor, Copilot, Claude) to accelerate development and exploring AI-oriented web platforms (Food Genie) with cloud deployments on Vercel, Netlify, and Render.",
      takeaways: [
        "Using AI tools to accelerate coding, debugging, research, and documentation",
        "Automated continuous cloud deployments on Vercel, Netlify, and Render",
        "Performance optimization and responsive interface polish",
      ],
      current: false,
    },
    {
      year: "Phase 4 • Present",
      title: "Final Year — Internship & Software Engineering Opportunities",
      role: "Open for Opportunities",
      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
      description:
        "Final-year Computer Science student actively seeking software engineering internships and junior developer roles to build clean, reliable, and high-performance web products.",
      takeaways: [
        "Available for immediate full-stack and frontend contributions",
        "Fast learner skilled in MERN stack and AI-accelerated workflows",
        "Strong collaborative work ethic and software engineering fundamentals",
      ],
      current: true,
    },
  ];

  return (
    <section
      id="journey"
      className="py-16 sm:py-20 relative overflow-hidden"
      aria-label="Developer Journey Section"
    >
      {/* Background glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent/8 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Progression & Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Developer <span className="text-gradient">Journey</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            The progression from academic foundations to full-stack engineering proficiency and applied AI workflows.
          </p>
        </motion.div>

        {/* Timeline Path */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line (hidden on small mobile, visible on sm+) */}
          <div className="hidden sm:block absolute left-8 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-emerald-500/80 -translate-x-1/2" />

          <div className="space-y-10 sm:space-y-12">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`relative flex flex-col sm:flex-row items-center gap-8 ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Center Node Icon (for desktop/tablet) */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-2 border-primary items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] z-10">
                    {item.icon}
                  </div>

                  {/* Content Card (Half width on sm+) */}
                  <div className="w-full sm:w-[calc(50%-2.5rem)]">
                    <div
                      className={`glass-effect p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
                        item.current
                          ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-400"
                          : "border-border/40 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                          {item.year}
                        </span>
                        {item.current && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                            Current Stage
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs font-medium text-accent mb-3">
                        {item.role}
                      </p>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-border/30">
                        {item.takeaways.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DeveloperJourney;
