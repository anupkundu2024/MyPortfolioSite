import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

export function RotatingBadge({ size = 120, className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-auto ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-md pointer-events-none" />

      {/* Rotating SVG circular text */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 18,
        }}
        viewBox="0 0 160 160"
        className="w-full h-full text-foreground/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <path
            id="circlePath"
            d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
          />
        </defs>
        <text
          fill="currentColor"
          className="text-[11.5px] font-bold tracking-[0.24em] uppercase fill-purple-300/90"
        >
          <textPath href="#circlePath" startOffset="0%">
            EXPLORE MORE • EXPLORE MORE • 
          </textPath>
        </text>
      </motion.svg>

      {/* Center Icon circle */}
      <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-background/90 border border-primary/40 backdrop-blur-md flex items-center justify-center text-primary shadow-inner group hover:scale-110 transition-transform duration-300">
        <ArrowDownRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
      </div>
    </div>
  );
}
