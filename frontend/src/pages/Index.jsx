import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Hero } from "@/sections/Hero/Hero";
import { About } from "@/sections/About/About";
import { FeaturedProjects } from "@/sections/Projects/FeaturedProjects";
import { ProjectExplorer } from "@/sections/Projects/ProjectExplorer";
import { SkillsSystem } from "@/sections/Skills/SkillsSystem";
import { GitHubActivity } from "@/sections/Github/GitHubActivity";
import { DeveloperJourney } from "@/sections/Journey/DeveloperJourney";
import { Contact } from "@/sections/Contact/Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      {/* 1. NAVIGATION */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 2. HERO */}
        <Hero />

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
      </main>

      {/* 10. FOOTER */}
      <Footer />
    </div>
  );
};

export default Index;
