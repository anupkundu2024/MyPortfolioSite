import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles, ArrowUpRight, ShieldCheck, TrendingUp, Bot, Compass } from "lucide-react";
import { PROJECTS_DATA } from "@/data/projects";
import { responsiveUnsplash } from "@/lib/unsplash";

const PROJECT_ICONS = {
  kundustocks: <TrendingUp className="w-5 h-5 text-emerald-400" />,
  "kundu-stocks": <TrendingUp className="w-5 h-5 text-emerald-400" />,
  wanderlust: <Compass className="w-5 h-5 text-pink-400" />,
  "food-genie": <Bot className="w-5 h-5 text-blue-400" />,
  "ak-expenses": <ShieldCheck className="w-5 h-5 text-purple-400" />,
};

export function FeaturedProjects() {
  const featuredProjects = PROJECTS_DATA.filter((p) => p.featured).map((project) => ({
    ...project,
    icon: PROJECT_ICONS[project.id] || <TrendingUp className="w-5 h-5 text-emerald-400" />,
  }));

  return (
    <section
      id="work"
      className="py-16 sm:py-20 relative overflow-hidden"
      aria-label="Featured Projects Section"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Priority Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Flagship full-stack applications solving practical problems in trading, travel, food exploration, and shared expense tracking.
          </p>
        </motion.div>

        {/* Featured Projects Grid */}
        <div className="space-y-10 sm:space-y-12">
          {featuredProjects.map((project, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="glass-effect rounded-3xl border border-border/40 hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-2xl group"
                aria-label={`Project: ${project.title}`}
              >
                <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
                  {/* Visual Preview Column (6 cols) */}
                  <div
                    className={`lg:col-span-6 relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/50 aspect-[16/10] ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <img
                      {...responsiveUnsplash(project.image, [480, 720, 900], { maxWidth: 1200 })}
                      sizes="(min-width: 1024px) 600px, calc(100vw - 5rem)"
                      alt={`Screenshot of ${project.title} - ${project.subtitle}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

                    {/* Priority badge on visual */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${project.badgeColor}`}>
                        {project.badge}
                      </span>
                    </div>

                    {/* Priority number tag */}
                    <div className="absolute bottom-4 right-4 z-10 font-mono text-2xl font-black text-white/40 select-none">
                      0{project.priority}
                    </div>
                  </div>

                  {/* Project Info Column (6 cols) */}
                  <div
                    className={`lg:col-span-6 space-y-5 flex flex-col justify-between ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Header & Subtitle */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-lg bg-secondary/80 border border-border/60">
                            {project.icon}
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                            Priority 0{project.priority}
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm font-medium text-primary/90 mt-0.5">
                          {project.subtitle}
                        </p>
                      </div>

                      {/* Value Proposition */}
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {project.description}
                      </p>

                      {/* Key Highlights list */}
                      <div className="space-y-2 pt-1" aria-label="Key features">
                        {project.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/85">
                            <span className="text-primary font-bold mt-0.5">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 pt-1" aria-label="Tech stack">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-medium bg-secondary/70 text-foreground/80 rounded-md border border-border/60 group-hover:border-primary/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/40">
                      {/* GitHub Link */}
                      {(project.githubUrl || project.github) && (
                        <a
                          href={project.githubUrl || project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/60 hover:border-primary/50 text-foreground text-xs sm:text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                          aria-label={`View source code for ${project.title} on GitHub`}
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code</span>
                        </a>
                      )}

                      {/* Live Demo Link */}
                      {(project.liveUrl || project.demo) && (
                        <a
                          href={project.liveUrl || project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-hero inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl"
                          aria-label={`Open live demo for ${project.title} in new tab`}
                        >
                          <span>Live Demo ↗</span>
                        </a>
                      )}

                      {/* Dashboard Link (KunduStocks) */}
                      {(project.dashboardUrl || project.dashboard) && (
                        <a
                          href={project.dashboardUrl || project.dashboard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-semibold transition-all duration-200"
                          aria-label={`Open trading dashboard for ${project.title} in new tab`}
                        >
                          <span>Trading Dashboard</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
