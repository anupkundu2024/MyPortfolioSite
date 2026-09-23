import { memo } from "react";

/**
 * Renders an assistant/user message safely.
 *
 * Model output is NEVER injected as HTML. Only a tiny markdown subset is
 * recognised and turned into React elements (which React escapes):
 *   - "- item" / "* item" bullet lines
 *   - **bold**
 *   - [label](https://…) links, bare https:// URLs and e-mail addresses
 * Links are only created for http(s) and mailto targets; anything else
 * (javascript:, data:, …) stays plain text.
 */

const TOKEN = /(\[[^\]\n]{1,200}\]\((?:https?:\/\/|mailto:)[^\s)]+\))|(\*\*[^*\n]+\*\*)|(https?:\/\/[^\s<>"'`]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)\]'"]+$/;

const isSafeHref = (href) => /^(https?:\/\/|mailto:)/i.test(href);

const linkClass =
  "text-primary underline decoration-primary/40 underline-offset-2 break-words hover:decoration-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm";

function ExternalLink({ href, children }) {
  if (!isSafeHref(href)) return children;
  const isMail = href.toLowerCase().startsWith("mailto:");
  return (
    <a
      href={href}
      className={linkClass}
      {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}

function renderInline(text, keyPrefix) {
  const nodes = [];
  let lastIndex = 0;
  let match;
  let index = 0;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(text))) {
    const [raw, mdLink, bold, url, email] = match;
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = `${keyPrefix}-${index++}`;

    if (mdLink) {
      const [, label, href] = mdLink.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      nodes.push(<ExternalLink key={key} href={href}>{label}</ExternalLink>);
    } else if (bold) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {bold.slice(2, -2)}
        </strong>
      );
    } else if (url) {
      // Keep sentence punctuation outside the link: "…/app/." -> link + "."
      const trailing = url.match(TRAILING_PUNCTUATION)?.[0] || "";
      const clean = trailing ? url.slice(0, -trailing.length) : url;
      nodes.push(<ExternalLink key={key} href={clean}>{clean}</ExternalLink>);
      if (trailing) nodes.push(trailing);
    } else if (email) {
      nodes.push(<ExternalLink key={key} href={`mailto:${email}`}>{email}</ExternalLink>);
    } else {
      nodes.push(raw);
    }
    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function FormattedText({ text }) {
  const blocks = [];
  let bullets = [];

  const flushBullets = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-1 space-y-1 pl-4 list-disc marker:text-primary/70">
        {bullets.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  text.split("\n").forEach((line, i) => {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }
    flushBullets();
    if (line.trim()) {
      blocks.push(<p key={`p-${i}`}>{renderInline(line, `p-${i}`)}</p>);
    }
  });
  flushBullets();

  return <div className="space-y-2">{blocks}</div>;
}

export const ChatMessage = memo(function ChatMessage({ message, onRetry }) {
  const isUser = message.role === "user";

  return (
    <div data-chat-message={message.role} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words ${
          isUser
            ? "rounded-br-md bg-gradient-to-br from-primary to-accent text-primary-foreground whitespace-pre-wrap"
            : message.error
            ? "rounded-bl-md border border-destructive/40 bg-destructive/10 text-foreground"
            : "rounded-bl-md border border-border/60 bg-secondary/70 text-foreground/90"
        }`}
      >
        {isUser ? message.content : <FormattedText text={message.content} />}

        {message.error && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;
