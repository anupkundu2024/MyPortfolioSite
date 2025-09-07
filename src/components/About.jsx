import { motion } from "framer-motion";

const skills = [
  { name: "HTML5", icon: "🌐" },
  { name: "CSS3", icon: "🎨" },
  { name: "JavaScript", icon: "⚡" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Git", icon: "📦" },
  { name: "Figma", icon: "🎯" },
  { name: "TailwindCSS", icon: "💨" },
  { name: "Material UI", icon: "🎨" },
  { name: "WordPress", icon: "🌐" },
  { name: "mySql", icon: "🛢️" }

];

export function About() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-gradient">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-effect p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-gradient">
              My Journey
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
            🚀 I'm a passionate Full Stack Developer and a 3rd-year Computer Science Engineering student. I love turning ideas into modern web applications with clean design and efficient functionality.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
            💡 As a quick learner, I constantly explore new technologies, build projects to sharpen my skills, and stay updated with industry trends. I'm eager to grow, contribute, and collaborate in the developer community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-center text-gradient">
              Skills & Technologies
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="skill-icon flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <span className="text-xs font-medium group-hover:text-primary transition-colors">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
