import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, RotateCcw } from "lucide-react";
import { PROJECTS_DATA, PROJECT_CATEGORIES } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function Work() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Compute category counts for badges
  const categoryCounts = useMemo(() => {
    const counts = { All: PROJECTS_DATA.length };
    PROJECT_CATEGORIES.forEach((cat) => {
      if (cat === "All") return;
      counts[cat] = PROJECTS_DATA.filter((p) => {
        if (cat === "Other") {
          return (
            p.category === "Other" ||
            !["Full Stack", "React", "AI", "JavaScript"].includes(p.category)
          );
        }
        return (
          p.category === cat ||
          p.technologies?.some(
            (t) => t.toLowerCase() === cat.toLowerCase()
          )
        );
      }).length;
    });
    return counts;
  }, []);

  // Filter projects dynamically based on active category & featured toggle
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
      // Check featured filter if toggle is enabled
      if (featuredOnly && !project.featured) {
        return false;
      }

      // Check category filter
      if (activeCategory === "All") {
        return true;
      }

      if (activeCategory === "Other") {
        return (
          project.category === "Other" ||
          !["Full Stack", "React", "AI", "JavaScript"].includes(project.category)
        );
      }

      return (
        project.category === activeCategory ||
        project.technologies?.some(
          (t) => t.toLowerCase() === activeCategory.toLowerCase()
        )
      );
    });
  }, [activeCategory, featuredOnly]);

  const featuredCount = useMemo(
    () => PROJECTS_DATA.filter((p) => p.featured).length,
    []
  );

  return (
    <section
      id="work"
      className="py-20 relative overflow-hidden"
      aria-label="Projects showcase"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase & Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Recent <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore web applications, tools, and platforms built with modern frontend frameworks, backend APIs, and AI models.
          </p>
        </motion.div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Filter Tabs */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 p-1.5 glass-effect rounded-2xl border border-border/40 w-full md:w-auto"
            role="tablist"
            aria-label="Project categories"
          >
            {PROJECT_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "text-primary-foreground font-semibold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>{category}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[11px] rounded-full font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Featured Toggle Button */}
          <button
            onClick={() => setFeaturedOnly((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ${
              featuredOnly
                ? "bg-primary/20 text-primary border-primary shadow-sm"
                : "glass-effect text-muted-foreground hover:text-foreground border-border/40"
            }`}
            aria-pressed={featuredOnly}
            aria-label="Filter featured projects"
          >
            <Sparkles
              size={16}
              className={
                featuredOnly
                  ? "text-primary fill-primary"
                  : "text-muted-foreground"
              }
            />
            <span>Featured Only</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {featuredCount}
            </span>
          </button>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 glass-effect rounded-2xl border border-border/40 p-8 max-w-md mx-auto mt-8"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              There are currently no projects matching your filter criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setFeaturedOnly(false);
              }}
              className="btn-hero text-sm px-5 py-2.5 inline-flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Work;
