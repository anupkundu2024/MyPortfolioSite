import { Download, FileText } from "lucide-react";
import { useCvAccess } from "./CvAccessProvider";

/**
 * The single entry point to the CV flow, reused by the hero CTA row, the desktop
 * navbar and the mobile menu. All variants call the same provider action — there
 * is no second implementation of the access logic.
 */
const VARIANTS = {
  // Secondary weight on purpose: it must not outrank the "View Projects" CTA.
  hero:
    "flex items-center gap-2 text-sm sm:text-base font-medium px-6 py-3.5 rounded-[var(--radius)] bg-secondary/70 hover:bg-secondary border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",

  // Quieter than the "Hire Me" pill next to it.
  nav:
    "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",

  // Matches the existing mobile drawer rows.
  mobile:
    "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-left text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
};

export function CvAccessButton({ variant = "hero", label = "Download CV", onActivate, className = "" }) {
  const { requestCvAccess } = useCvAccess();

  const handleClick = () => {
    // Called synchronously so the provider can reserve a tab before any await.
    requestCvAccess();
    onActivate?.();
  };

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`${VARIANTS.mobile} ${className}`}
        aria-label="Download Anup Kundu's CV"
      >
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>{label}</span>
        </span>
        <span className="text-xs text-muted-foreground font-mono" aria-hidden="true">
          →
        </span>
      </button>
    );
  }

  const Icon = variant === "nav" ? FileText : Download;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${VARIANTS[variant] ?? VARIANTS.hero} ${className}`}
      aria-label="Download Anup Kundu's CV"
    >
      <Icon className={variant === "nav" ? "w-3.5 h-3.5" : "w-4 h-4"} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default CvAccessButton;
