import { useState, useEffect } from "react";
import { Menu, X, Github, Linkedin, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Projects", id: "featured-projects" },
  { name: "Explorer", id: "project-explorer" },
  { name: "Skills", id: "skills" },
  { name: "Activity", id: "github-activity" },
  { name: "Journey", id: "journey" },
  { name: "Contact", id: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 40);

      // Active section detection
      const scrollPosition = offset + 200;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const targetId = NAV_LINKS[i].id;
        const section = document.getElementById(targetId) || (targetId === "featured-projects" ? document.getElementById("work") : null);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(targetId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    let element = document.getElementById(sectionId);
    if (!element && sectionId === "featured-projects") {
      element = document.getElementById("work");
    }
    if (!element && sectionId === "work") {
      element = document.getElementById("featured-projects");
    }
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/50 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent py-5"
      }`}
      role="banner"
    >
      <nav
        className="container mx-auto px-4 sm:px-6 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Brand */}
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-2.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Anup Kundu Home"
        >
          <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary text-xs group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            AK
          </span>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            ANUP <span className="text-gradient font-extrabold">KUNDU</span>
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 bg-secondary/40 border border-border/40 rounded-full px-3.5 py-1.5 backdrop-blur-md">
          {NAV_LINKS.map(({ name, id }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`relative px-3 py-1 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {name}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full animate-fade-in" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Quick Developer Profiles & CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="https://github.com/anupkundu2024"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all"
            aria-label="GitHub Profile (opens in a new tab)"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/anupkundu-linkdin/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all"
            aria-label="LinkedIn Profile (opens in a new tab)"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <button
            onClick={() => scrollToSection("contact")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 hover:border-primary transition-all duration-200 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden text-foreground p-2 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-[60px] bg-background/95 backdrop-blur-2xl border-b border-border shadow-2xl p-6 transition-all duration-300 max-h-[calc(100vh-60px)] overflow-y-auto"
        >
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map(({ name, id }) => (
              <button
                key={id}
                onClick={() => {
                  scrollToSection(id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-left transition-colors cursor-pointer ${
                  activeSection === id
                    ? "bg-primary/15 text-primary font-semibold border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <span>{name}</span>
                <span className="text-xs text-muted-foreground font-mono">→</span>
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-border/50 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-4 py-2">
                <a
                  href="https://github.com/anupkundu2024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary p-2"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/anupkundu-linkdin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary p-2"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>

              <button
                onClick={() => {
                  scrollToSection("contact");
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-hero py-3 text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get In Touch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
