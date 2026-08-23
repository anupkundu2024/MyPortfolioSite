import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";

export function ProjectCard({ project }) {
  const {
    title,
    description,
    category,
    technologies = [],
    githubUrl,
    liveUrl,
    dashboardUrl,
    image,
    featured,
    status,
    year,
  } = project;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4 }}
      className={`project-card group flex flex-col h-full relative ${
        featured ? "border-primary/40 shadow-lg shadow-primary/5" : ""
      }`}
      aria-label={`Project card for ${title}`}
    >
      {/* Image and Badges Header */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-muted/20">
        <img
          src={image}
          alt={`${title} - Project preview screenshot`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-2">
            {featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground shadow-md backdrop-blur-md">
                <Sparkles size={12} className="fill-current" />
                Featured
              </span>
            )}
            {category && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-background/85 text-foreground backdrop-blur-md border border-border/50 shadow-sm">
                {category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {status && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-background/85 text-foreground backdrop-blur-md border border-border/50 shadow-sm">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status.toLowerCase() === "live"
                      ? "bg-emerald-400 animate-pulse"
                      : status.toLowerCase() === "in progress"
                      ? "bg-amber-400"
                      : "bg-primary"
                  }`}
                />
                {status}
              </span>
            )}
            {year && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-background/85 text-muted-foreground backdrop-blur-md border border-border/50 shadow-sm">
                {year}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {/* Tech Stack Pills */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5" aria-label="Technologies used">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Action Button Links */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-border/40">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
                aria-label={`Open live demo for ${title} in a new tab`}
              >
                <span>Live Demo ↗</span>
              </a>
            )}

            {dashboardUrl && (
              <a
                href={dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-secondary border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all"
                aria-label={`Open dashboard for ${title} in a new tab`}
              >
                <ExternalLink size={15} />
                <span>Dashboard</span>
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg glass-effect border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all ml-auto"
                aria-label={`View source code for ${title} on GitHub (opens in a new tab)`}
              >
                <Github size={15} />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
