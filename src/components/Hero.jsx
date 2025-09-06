import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ParticleBackground } from "./ParticleBackground";

export function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleBackground />

      <div className="container mx-auto px-6 z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 items-center min-h-[calc(100vh-5rem)]">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-left"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Hi, I'm <span className="text-gradient">Anup</span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground min-h-[2.5rem] md:min-h-[3rem]">
                <Typewriter
                  words={[
                    "Full Stack Developer",
                    "MERN Stack Developer",
                    "Web Developer",
                    "Quick Learner",
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              I craft beautiful and functional web experiences with modern
              technologies. Passionate about creating intuitive user interfaces
              that make a difference.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <button
                onClick={scrollToContact}
                className="btn-hero text-lg px-8 py-4 animate-float"
              >
                Let's Connect
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - Profile picture */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative max-w-md lg:max-w-lg">
              <img
                src="https://i.postimg.cc/fyCnLbKz/IMG-20250829-WA0104-2.jpg" // Replace with your actual image path
                alt="Anup's Profile"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
