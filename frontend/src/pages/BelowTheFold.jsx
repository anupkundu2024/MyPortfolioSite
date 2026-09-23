import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/navigation/Footer";
import { About } from "@/sections/About/About";
import { FeaturedProjects } from "@/sections/Projects/FeaturedProjects";
import { ProjectExplorer } from "@/sections/Projects/ProjectExplorer";
import { SkillsSystem } from "@/sections/Skills/SkillsSystem";
import { GitHubActivity } from "@/sections/Github/GitHubActivity";
import { DeveloperJourney } from "@/sections/Journey/DeveloperJourney";
import { Contact } from "@/sections/Contact/Contact";

/**
 * Everything below the hero. Loaded as one lazy chunk (together with
 * framer-motion) right after the hero paints, so the first screen only ships
 * the navbar + hero. The sections render in full once loaded, keeping page
 * height, anchors and scroll positions exactly as before.
 *
 * reducedMotion="user" keeps the fades but drops movement for visitors who
 * ask the OS for reduced motion.
 */
export default function BelowTheFold() {
  return (
    <MotionConfig reducedMotion="user">
      {/* 3. ABOUT / IDENTITY */}
      <About />

      {/* 4. FEATURED PROJECTS */}
      <FeaturedProjects />

      {/* 5. PROJECT EXPLORER */}
      <ProjectExplorer />

      {/* 6. SKILLS / TECHNOLOGY SYSTEM */}
      <SkillsSystem />

      {/* 7. GITHUB ACTIVITY */}
      <GitHubActivity />

      {/* 8. DEVELOPER JOURNEY */}
      <DeveloperJourney />

      {/* 9. CONTACT */}
      <Contact />
    </MotionConfig>
  );
}

/** Rendered outside <main>, like before; ships in the same chunk. */
export function DeferredFooter() {
  return (
    <MotionConfig reducedMotion="user">
      <Footer />
    </MotionConfig>
  );
}
