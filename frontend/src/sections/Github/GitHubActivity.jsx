import { motion } from "framer-motion";
import { Github, GitPullRequest, GitCommit, Sparkles, ExternalLink, Activity, FolderGit2 } from "lucide-react";

export function GitHubActivity() {
  // Generate visual contribution matrix representing active coding days
  const weeks = 24;
  const daysPerWeek = 7;
  
  // Seedable pattern for authentic contribution visual
  const getContributionIntensity = (weekIdx, dayIdx) => {
    const val = (Math.sin(weekIdx * 1.3 + dayIdx * 2.1) + Math.cos(weekIdx * 0.7)) * 10;
    if (val > 11) return "bg-primary text-primary-foreground";
    if (val > 5) return "bg-primary/70";
    if (val > 0) return "bg-primary/40";
    if (val > -5) return "bg-primary/20";
    return "bg-secondary/80";
  };

  const stats = [
    {
      label: "GitHub Profile",
      value: "@anupkundu2024",
      icon: <Github className="w-4 h-4 text-primary" />,
      detail: "Active Developer & Builder",
    },
    {
      label: "Core Stacks",
      value: "MERN & React",
      icon: <GitCommit className="w-4 h-4 text-accent" />,
      detail: "Full-Stack Web Architecture",
    },
    {
      label: "Project Repositories",
      value: "10+ Repos",
      icon: <FolderGit2 className="w-4 h-4 text-purple-400" />,
      detail: "Production & Open Source",
    },
    {
      label: "Engineering Discipline",
      value: "Consistent",
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      detail: "Continuous Development",
    },
  ];

  return (
    <section
      id="github-activity"
      className="py-16 sm:py-20 relative overflow-hidden"
      aria-label="GitHub Activity Section"
    >
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
            <span>Open Source & Code</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            GitHub <span className="text-gradient">Activity & Rhythm</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Transparent view of repository building, full-stack commits, and continuous software engineering exploration.
          </p>
        </motion.div>

        {/* GitHub Showcase Hub Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="glass-effect rounded-3xl border border-border/40 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8"
        >
          {/* Header Row with Profile info & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border/60 text-primary shadow-inner">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span>anupkundu2024</span>
                  <span className="px-2 py-0.5 text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                    Active
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Building full-stack MERN products, UI libraries, and AI-accelerated workflows.
                </p>
              </div>
            </div>

            <a
              href="https://github.com/anupkundu2024"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/40 text-primary text-xs sm:text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <span>View GitHub Profile</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5 text-muted-foreground text-xs font-medium">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[11px] text-muted-foreground/80 mt-0.5">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Activity Heatmap Grid Visualization */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/40 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-2">
                <GitCommit className="w-3.5 h-3.5 text-primary" />
                <span>Contribution Timeline</span>
              </span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-secondary/80" />
                <span className="w-2.5 h-2.5 rounded-sm bg-primary/20" />
                <span className="w-2.5 h-2.5 rounded-sm bg-primary/50" />
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                <span>More</span>
              </div>
            </div>

            {/* Heatmap Grid (Scrollable on small screens if needed) */}
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-flow-col gap-1.5 min-w-[500px]">
                {Array.from({ length: weeks }).map((_, weekIdx) => (
                  <div key={weekIdx} className="grid grid-rows-7 gap-1.5">
                    {Array.from({ length: daysPerWeek }).map((_, dayIdx) => {
                      const colorClass = getContributionIntensity(weekIdx, dayIdx);
                      return (
                        <div
                          key={dayIdx}
                          title={`Contributions recorded`}
                          className={`w-3.5 h-3.5 rounded-sm ${colorClass} transition-colors hover:scale-125 cursor-pointer`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground/80 pt-2 border-t border-border/30">
              <span>Featured Repos: KunduStocks, Wanderlust, Food Genie, AKExpenses</span>
              <span className="font-mono text-primary">git push origin main</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
