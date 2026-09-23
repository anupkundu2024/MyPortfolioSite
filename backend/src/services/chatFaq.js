import { ANUP_PROFILE } from "../data/anupProfile.js";

/**
 * Instant answers for simple, unambiguous questions, served straight from the
 * verified profile without calling Gemini (no latency, no quota).
 *
 * Matching is deliberately conservative: only short messages whose intent is
 * obvious are answered here. Anything nuanced ("compare his projects", "is he
 * good at React?") falls through to the model.
 */

const MAX_FAQ_LENGTH = 80;

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9@.'\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const { links } = ANUP_PROFILE;

const findProject = (text) =>
  ANUP_PROFILE.featuredProjects.find((project) =>
    project.aliases.some((alias) => alias.length > 4 && text.includes(alias))
  );

const projectLinksAnswer = (project) => {
  const lines = [`**${project.name}** — ${project.tagline}.`];
  if (project.links.live) lines.push(`Live demo: ${project.links.live}`);
  if (project.links.dashboard) lines.push(`Trading dashboard: ${project.links.dashboard}`);
  if (project.links.github) lines.push(`Source code: ${project.links.github}`);
  return lines.join("\n");
};

const RULES = [
  {
    // "what's his github", "github link", "where can I find Anup's GitHub?"
    test: (t) => /\bgithub\b/.test(t) && !/\b(project|repo of|kundustocks|wanderlust|food|expense)\b/.test(t),
    answer: () =>
      `You can find Anup's GitHub profile here: ${links.github}\nIt has the source code for his projects, including KunduStocks, Wanderlust, Food Genie and AKExpenses.`,
  },
  {
    test: (t) => /\blinked ?in\b/.test(t),
    answer: () => `Here is Anup's LinkedIn profile: ${links.linkedin}`,
  },
  {
    test: (t) => /\b(portfolio|website)\b/.test(t) && /\b(link|url|where|what)\b/.test(t),
    answer: () => `Anup's portfolio is at ${links.portfolio} — you're on it right now!`,
  },
  {
    // "how can I contact anup", "contact info", "email"
    test: (t) => /\b(contact|reach|get in touch|email|e-mail|mail)\b/.test(t) && !/\bproject\b/.test(t),
    answer: () =>
      [
        "You can reach Anup through:",
        `- The Contact section of this portfolio: ${links.portfolio}#contact`,
        `- LinkedIn: ${links.linkedin}`,
        `- Email: ${links.email}`,
      ].join("\n"),
  },
  {
    // "where can I try food genie", "food genie link", "show me wanderlust demo"
    test: (t) => Boolean(findProject(t)) && /\b(link|url|demo|live|try|where|open|visit|source|repo|code)\b/.test(t),
    answer: (t) => projectLinksAnswer(findProject(t)),
  },
  {
    // "who is anup", "who is anup kundu?", "tell me about anup"
    test: (t) => /^(who is|who's|tell me about|about) anup( kundu)?$/.test(t),
    answer: () =>
      [
        `**Anup Kundu** is a Full-Stack Developer (MERN stack) and a final-year B.Tech Computer Science & Engineering student based in ${ANUP_PROFILE.location}.`,
        "He builds practical full-stack web apps with React, Node.js, Express and MongoDB, and uses AI tools to speed up development. Featured projects include KunduStocks, Wanderlust, Food Genie and AKExpenses.",
        "He's currently open to software engineering internships and junior roles.",
      ].join("\n"),
  },
];

/** Returns a verified static reply, or null when the question needs the model. */
export function answerFromFaq(message) {
  if (!message || message.length > MAX_FAQ_LENGTH) return null;
  const text = normalize(message).replace(/\s*\?$/, "");
  const rule = RULES.find((candidate) => candidate.test(text));
  return rule ? rule.answer(text) : null;
}
