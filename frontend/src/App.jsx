import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CursorGlow } from "@/components/common/CursorGlow";
import { AuthProvider } from "@/context/AuthContext";
import { CvAccessProvider } from "@/components/cv";
import { whenIdle } from "@/lib/idle";
import Index from "./pages/Index";

// Only the contact form raises toasts, long after first paint, so the toaster
// (sonner + next-themes) is mounted once the page is idle.
const Sonner = lazy(() =>
  import("@/components/ui/sonner").then((module) => ({ default: module.Toaster }))
);
const NotFound = lazy(() => import("./pages/NotFound"));

function DeferredToaster() {
  const [ready, setReady] = useState(false);
  useEffect(() => whenIdle(() => setReady(true), { timeout: 3000 }), []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <Sonner />
    </Suspense>
  );
}

const App = () => (
  <>
    <DeferredToaster />
    <CursorGlow />
    {/* Session + CV access flow. Wraps the router so every entry point shares
        one modal instance; it renders nothing until a CV button is clicked. */}
    <AuthProvider>
      <CvAccessProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="*"
              element={
                <Suspense fallback={null}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </CvAccessProvider>
    </AuthProvider>
  </>
);

export default App;
