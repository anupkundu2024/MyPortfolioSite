import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, CloudSun, Box, FolderGit2, Sparkles } from "lucide-react";

export function ProjectExplorer() {
  const [activeFilter, setActiveFilter] = useState("all");

  const explorerProjects = [
    {
      id: "weather-app",
      title: "Weather Dashboard",
      category: "frontend",
      categoryName: "Frontend & APIs",
      description:
        "An intuitive weather forecasting application featuring real-time location metrics via OpenWeather API, dynamic weather indicators, temperature conversions, and responsive mobile layouts.",
      technologies: ["React", "JavaScript", "OpenWeather API", "Tailwind CSS"],
      github: "https://github.com/anupkundu2024/weather-app-react/tree/main/mini-project",
      demo: "https://react-weather-app2025.netlify.app/",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
      icon: <CloudSun className="w-5 h-5 text-amber-400" />,
    },
    {
      id: "portfolio-website",
      title: "3D Developer Portfolio",
      category: "frontend",
      categoryName: "3D & Interactive UI",
      description:
        "High-performance developer portfolio featuring a customized Three.js particle canvas, smooth Framer Motion animations, accessible UI, and Web3Forms contact integration.",
      technologies: ["React", "Three.js", "Framer Motion", "Tailwind CSS", "Vite"],
      github: "https://github.com/anupkundu2024/MyPortfolioSite",
      demo: "https://anupportfolio2025.vercel.app/",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
      icon: <Box className="w-5 h-5 text-purple-400" />,
    },
    {
      id: "github-repos",
      title: "Open Source & Code Experiments",
      category: "experiments",
      categoryName: "Practice & Repos",
      description:
        "Explore additional backend utility services, algorithmic coding challenges, React experiments, and open-source contributions directly on GitHub.",
      technologies: ["JavaScript ES6+", "Node.js", "Algorithms", "Git"],
      github: "https://github.com/anupkundu2024?tab=repositories",
      demo: "https://github.com/anupkundu2024",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop",
      icon: <FolderGit2 className="w-5 h-5 text-primary" />,
      isExternalHub: true,
    },
  ];

  const filteredProjects = explorerProjects.filter((project) => {
    if (activeFilter === "all") return true;
    return project.category === activeFilter;
  });

  const filterButtons = [
    { id: "all", label: "All Additional Works" },
    { id: "frontend", label: "Frontend & APIs" },
    { id: "experiments", label: "Practice & Repos" },
  ];

  return (
    <section
      id="project-explorer"
      className="py-16 sm:py-20 relative overflow-hidden"
      aria-label="Project Explorer Section"
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
            <span>Additional Projects & Practice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Project <span className="text-gradient">Explorer</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Specialized UI components, weather integrations, 3D canvas experiments, and open-source code repositories.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <div
              className="inline-flex items-center gap-1.5 p-1 rounded-full bg-secondary/70 border border-border/50 backdrop-blur-md"
              role="toolbar"
              aria-label="Filter additional projects"
            >
              {filterButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id)}
                  aria-pressed={activeFilter === btn.id}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    activeFilter === btn.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="project-card group flex flex-col justify-between"
                aria-label={`Project: ${project.title}`}
              >
                <div>
                  {/* Image Preview Container */}
                  <div className="aspect-[16/10] overflow-hidden relative border-b border-border/40">
                    <img
                      src={project.image}
                      alt={`${project.title} - Project preview`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[11px] font-semibold bg-background/80 backdrop-blur-md text-foreground/90 rounded-full border border-border/60">
                        {project.categoryName}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-border/60">
                        {project.icon}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[11px] font-medium bg-primary/10 text-primary rounded border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer / Links */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-border/30 mt-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
                  >
                    <Github className="w-4 h-4" />
                    <span>{project.isExternalHub ? "GitHub Hub" : "Source Code"}</span>
                  </a>

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors group-hover:translate-x-0.5"
                      aria-label={`Open live demo for ${project.title} in new tab`}
                    >
                      <span>{project.isExternalHub ? "Explore Repos" : "Live Demo"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectExplorer;
