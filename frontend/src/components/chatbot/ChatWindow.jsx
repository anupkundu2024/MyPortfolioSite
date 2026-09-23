import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { MAX_MESSAGE_LENGTH } from "./chatLimits";

/**
 * Chat panel UI. Desktop: floating panel bottom-right. Mobile: bottom sheet
 * that leaves the navbar visible. Non-modal, so the page stays usable.
 */
export function ChatWindow({ open, onClose, messages, pending, showSuggestions, onSend, onRetry }) {
  const titleId = useId();
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);

  // Focus the input when opened.
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Escape closes the chat (from anywhere while it is open).
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !event.defaultPrevented) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, pending, open]);

  // Grow the textarea with its content, up to ~5 lines.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  }, [draft]);

  const submit = (text = draft) => {
    if (!text.trim() || pending) return;
    onSend(text);
    setDraft("");
  };

  const handleKeyDown = (event) => {
    // Enter sends, Shift+Enter adds a newline. Ignore Enter while an IME is composing.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const remaining = MAX_MESSAGE_LENGTH - draft.length;

  return (
    <section
      id="anup-ai-chat"
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      // Kept mounted while closed so the conversation survives; `hidden` class
      // (not the attribute) because Tailwind's `flex` would override the attribute.
      className={`${open ? "flex" : "hidden"} fixed z-[60] flex-col overflow-hidden border border-primary/30 bg-[hsl(var(--card)/0.92)] backdrop-blur-2xl shadow-[0_24px_70px_-20px_hsla(280,100%,50%,0.45)]
        inset-x-0 bottom-0 h-[min(85dvh,640px)] rounded-t-3xl
        sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[390px] sm:h-[min(620px,calc(100dvh-8rem))] sm:rounded-2xl
        animate-in fade-in-0 slide-in-from-bottom-4 duration-200`}
    >
      {/* Ambient theme glow, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[90px]"
      />

      {/* Header */}
      <header className="relative flex items-center gap-3 border-b border-border/50 px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_0_16px_hsl(280_100%_70%/0.4)]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-sm font-bold text-foreground">
            Anup AI
          </h2>
          <p className="truncate text-xs text-muted-foreground">Ask me about Anup Kundu</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Messages */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="relative flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            // Only the latest failed answer can be retried.
            onRetry={
              message.error && message.retryText && index === messages.length - 1 && !pending
                ? () => onRetry(message)
                : undefined
            }
          />
        ))}

        {showSuggestions && <SuggestedQuestions onSelect={submit} disabled={pending} />}

        {pending && (
          <div role="status" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden="true" />
            <span>Anup AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        className="relative border-t border-border/50 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="flex items-end gap-2">
          <label htmlFor={`${titleId}-input`} className="sr-only">
            Ask a question about Anup
          </label>
          <textarea
            id={`${titleId}-input`}
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about skills, projects, availability…"
            className="max-h-[120px] min-h-[42px] flex-1 resize-none rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            aria-label="Send message"
            className="btn-hero flex h-[42px] w-[42px] shrink-0 items-center justify-center !p-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-1.5 flex justify-between px-1 text-[11px] text-muted-foreground/70">
          <span>AI answers from Anup's portfolio. Not stored.</span>
          {remaining <= 100 && <span aria-live="polite">{remaining} left</span>}
        </p>
      </form>
    </section>
  );
}

export default ChatWindow;
