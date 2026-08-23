import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const professionalLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-4 h-4" />,
      url: "https://github.com/anupkundu2024",
      ariaLabel: "Anup Kundu's GitHub Profile (opens in new tab)",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      url: "https://www.linkedin.com/in/anupkundu-linkdin/",
      ariaLabel: "Anup Kundu's LinkedIn Profile (opens in new tab)",
    },
    {
      name: "Twitter / X",
      icon: <Twitter className="w-4 h-4" />,
      url: "https://x.com/anupkundu_",
      ariaLabel: "Anup Kundu's Twitter Profile (opens in new tab)",
    },
    {
      name: "Email",
      icon: <Mail className="w-4 h-4" />,
      url: "mailto:anupbubay9986@gmail.com",
      ariaLabel: "Send an email to Anup Kundu",
    },
  ];

  return (
    <footer
      className="border-t border-border/30 py-10 relative overflow-hidden bg-background/60 backdrop-blur-md"
      aria-label="Site Footer"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Copyright & Info */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-sm font-semibold text-foreground">
              © {new Date().getFullYear()} Anup Kundu. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with React, Vite, Tailwind CSS, Framer Motion & Three.js.
            </p>
          </div>

          {/* Developer Profile Links & Back to Top */}
          <div className="flex gap-3 flex-wrap justify-center items-center">
            {professionalLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto") ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-muted-foreground hover:text-primary transition-colors p-2.5 rounded-lg bg-secondary/40 hover:bg-primary/10 border border-border/40 hover:border-primary/40 duration-200 flex items-center gap-2 text-xs font-medium"
                aria-label={link.ariaLabel}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.name}</span>
              </motion.a>
            ))}

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-lg bg-secondary/40 hover:bg-primary/10 border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-primary transition-colors duration-200 ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Back to top of page"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
