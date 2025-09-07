import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  // {
  //   id: 1,
  //   title: "E-Commerce Platform",
  //   description:
  //     "A modern e-commerce solution built with React, Node.js, and MongoDB. Features include real-time inventory, secure payments, and admin dashboard.",
  //   image:
  //     "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  //   tags: ["React", "Node.js", "MongoDB", "Stripe"],
  //   github: "#",
  //   demo: "#",
  // },
  {
    id: 2,
    title: "Wanderlust",
    description:
      "Collaborative task management application with real-time updates, drag & drop functionality, and team collaboration features.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    tags: ["React", "Socket.io", "Express", "PostgreSQL"],
    github: "https://github.com/anupkundu2024/wanderlust-Project",
    demo: "https://anupkundu2024.github.io/wanderlust-Project/",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description:
      "Beautiful weather application with location-based forecasts, interactive maps, and personalized weather alerts.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
    tags: ["JavaScript", "API Integration", "Chart.js"],
    github: "https://github.com/anupkundu2024/weather-app-react/tree/main/mini-project",
    demo: "https://react-weather-app2025.netlify.app/",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description:
      "Responsive portfolio website with Three.js animations, smooth scrolling, and dynamic content management.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    tags: ["React", "Three.js", "Framer Motion"],
    github: "#",
    demo: "#",
  },
];

export function Work() {
  return (
    <section id="work" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Recent <span className="text-gradient">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for
            creating exceptional digital experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="project-card group"
            >
              <div className="aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={20} />
                    <span>Code</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink size={20} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
