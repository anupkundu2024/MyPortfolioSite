import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

/**
 * "Ask Anup" floating button. This file is the ONLY chatbot code in the
 * initial bundle (~1 KB). The chat window, its state and all network logic
 * live in ./Chatbot and are downloaded only when the visitor shows intent
 * (hover / focus / touch on the button) or clicks it.
 */
const loadChatbot = () => import("./Chatbot");
const Chatbot = lazy(loadChatbot);

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  // Stays true after the first open so the conversation survives closing.
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef(null);

  const openChat = () => {
    setMounted(true);
    setOpen(true);
  };

  const closeChat = useCallback(() => {
    setOpen(false);
    // Return focus to the launcher once it is visible again.
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openChat}
        onPointerEnter={loadChatbot}
        onFocus={loadChatbot}
        onTouchStart={loadChatbot}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={mounted ? "anup-ai-chat" : undefined}
        aria-label="Ask Anup AI, the portfolio assistant"
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/80 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md shadow-[0_0_24px_hsl(280_100%_70%/0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_0_32px_hsl(280_100%_70%/0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          open ? "pointer-events-none opacity-0 scale-90" : "opacity-100"
        }`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span>Ask Anup</span>
      </button>

      {mounted && (
        <Suspense
          fallback={
            <div
              role="status"
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] rounded-full border border-primary/40 bg-background/90 px-4 py-2.5 text-sm text-muted-foreground backdrop-blur-md"
            >
              Opening Anup AI…
            </div>
          }
        >
          <Chatbot open={open} onClose={closeChat} />
        </Suspense>
      )}
    </>
  );
}

export default ChatLauncher;
