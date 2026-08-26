import { motion } from "framer-motion";
import { useState } from "react";
import { Github, Linkedin, Twitter, Mail, ArrowUp, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PrivacyNotice } from "@/components/cv";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

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
            <button
              onClick={() => setPrivacyOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded pt-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>CV Access Privacy Notice</span>
            </button>
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

      {/* Privacy notice for the authenticated CV feature. Rendered as a dialog so
          no new route is introduced and the existing SEO setup is untouched. */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] sm:w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-[hsl(var(--glass-border)/0.35)] bg-[hsl(var(--card)/0.95)] backdrop-blur-2xl p-6 sm:p-7">
          <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground">
            CV Access <span className="text-gradient">Privacy Notice</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This applies only to the CV download feature. Browsing the rest of this site requires no
            account and collects nothing.
          </DialogDescription>
          <div className="pt-2">
            <PrivacyNotice />
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export default Footer;
