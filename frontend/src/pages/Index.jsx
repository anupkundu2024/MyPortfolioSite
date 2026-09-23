import { lazy, Suspense, useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/sections/Hero/Hero";
import { whenIdle } from "@/lib/idle";

// Sections 3–10 live in one deferred chunk (see BelowTheFold.jsx). Only the
// navbar and hero are part of the initial bundle.
const loadBelowTheFold = () => import("./BelowTheFold");
const BelowTheFold = lazy(loadBelowTheFold);
const DeferredFooter = lazy(() =>
  loadBelowTheFold().then((module) => ({ default: module.DeferredFooter }))
);

const EARLY_TRIGGERS = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"];

/**
 * Mounts the below-the-fold content right after the hero has painted, or
 * immediately if the visitor starts scrolling/interacting before that, so the
 * sections are always in place before they are needed.
 */
function useBelowTheFoldReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return undefined;

    // Start downloading now (network only); rendering waits for idle time.
    loadBelowTheFold();

    const show = () => setReady(true);
    const cancelIdle = whenIdle(show, { timeout: 800 });
    EARLY_TRIGGERS.forEach((type) =>
      window.addEventListener(type, show, { once: true, passive: true })
    );

    return () => {
      cancelIdle();
      EARLY_TRIGGERS.forEach((type) => window.removeEventListener(type, show));
    };
  }, [ready]);

  return ready;
}

// Reserves roughly one screen below the hero while the sections load, so the
// page never looks like it ends at the hero.
const SectionsPlaceholder = () => <div className="min-h-screen" aria-hidden="true" />;

const Index = () => {
  const belowTheFoldReady = useBelowTheFoldReady();

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      {/* 1. NAVIGATION */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 2. HERO */}
        <Hero />

        {/* 3–9. About → Contact (deferred chunk) */}
        {belowTheFoldReady ? (
          <Suspense fallback={<SectionsPlaceholder />}>
            <BelowTheFold />
          </Suspense>
        ) : (
          <SectionsPlaceholder />
        )}
      </main>

      {/* 10. FOOTER */}
      {belowTheFoldReady && (
        <Suspense fallback={null}>
          <DeferredFooter />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
