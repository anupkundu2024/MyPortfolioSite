import { ANUP_PROFILE } from "../data/anupProfile.js";

/**
 * Lightweight intent routing for "Anup AI".
 *
 * Every message is classified first. Simple, self-contained questions
 * ("who is anup?", "github?", "food genie demo") are answered instantly from
 * the verified profile — no Gemini call, no latency, no quota. Anything
 * nuanced, comparative, or that depends on earlier turns ("tell me more about
 * the second one", "why should I hire him?") returns `reply: null` and is sent
 * to Gemini together with the conversation history.
 *
 * Matching tolerates case, punctuation, possessives, joined/split words
 * ("linked in", "foodgenie") and small typos ("githb", "intership").
 * It is deliberately conservative: when in doubt, defer to the model.
 */

export const INTENTS = Object.freeze({
  GREETING: "GREETING",
  SMALL_TALK: "SMALL_TALK",
  ASSISTANT: "ASSISTANT",
  SECURITY: "SECURITY",
  UNVERIFIED: "UNVERIFIED",
  ABOUT: "ABOUT",
  EDUCATION: "EDUCATION",
  SKILLS: "SKILLS",
  PROJECTS: "PROJECTS",
  PROJECT_DETAIL: "PROJECT_DETAIL",
  LIVE_DEMO: "LIVE_DEMO",
  GITHUB: "GITHUB",
  LINKEDIN: "LINKEDIN",
  PORTFOLIO: "PORTFOLIO",
  CV: "CV",
  CONTACT: "CONTACT",
  AVAILABILITY: "AVAILABILITY",
  LOCATION: "LOCATION",
  CONTEXTUAL: "CONTEXTUAL",
  OTHER: "OTHER",
});

// Longer messages are almost always nuanced; leave them to the model.
const MAX_STATIC_WORDS = 14;

const { links, featuredProjects } = ANUP_PROFILE;

// ---------------------------------------------------------------------------
// Text analysis
// ---------------------------------------------------------------------------

const normalize = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/'s\b/g, "") // anup's -> anup
    .replace(/'/g, "") // what's -> whats
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const analyze = (text) => {
  const tokens = text ? text.split(" ") : [];
  // Adjacent pairs joined, so "linked in" / "food genie" / "git hub" match too.
  const joined = tokens.slice(0, -1).map((token, i) => token + tokens[i + 1]);
  return { text, tokens, candidates: [...tokens, ...joined] };
};

/** Optimal string alignment distance, bounded for speed. */
const distance = (a, b) => {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }
  return rows[a.length][b.length];
};

const tolerance = (word) => (word.length >= 8 ? 2 : word.length >= 5 ? 1 : 0);

/** Exact word or phrase match (phrases are matched on word boundaries). */
const has = (q, ...words) =>
  words.some((word) => (word.includes(" ") ? ` ${q.text} `.includes(` ${word} `) : q.tokens.includes(word)));

/** Typo-tolerant match for distinctive content words (same first letter required). */
const hasFuzzy = (q, ...words) =>
  words.some((word) => {
    const max = tolerance(word);
    return q.candidates.some(
      (candidate) =>
        candidate === word ||
        (max > 0 &&
          candidate[0] === word[0] &&
          Math.abs(candidate.length - word.length) <= max &&
          distance(candidate, word) <= max)
    );
  });

// ---------------------------------------------------------------------------
// Project lookup
// ---------------------------------------------------------------------------

// Distinctive names are matched with typo tolerance; generic words exactly.
const PROJECT_MATCHERS = {
  KunduStocks: { names: ["kundustocks", "kundustock"], words: ["stock", "stocks", "trading", "zerodha"] },
  Wanderlust: { names: ["wanderlust"], words: ["airbnb", "travel", "accommodation", "listings"] },
  "Food Genie": { names: ["foodgenie"], words: ["food", "genie", "food ordering"] },
  AKExpenses: {
    names: ["akexpenses", "akexpense"],
    words: ["expense", "expenses", "roommate", "roommates", "settlement", "splitting"],
  },
};

const findProjects = (q) =>
  featuredProjects.filter((project) => {
    const matcher = PROJECT_MATCHERS[project.name];
    return matcher && (hasFuzzy(q, ...matcher.names) || has(q, ...matcher.words));
  });

// ---------------------------------------------------------------------------
// Verified answers
// ---------------------------------------------------------------------------

// "Stock trading…" -> "stock trading…", but leave acronyms alone ("AI-assisted…").
const lowerFirst = (text) => (/^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text);

const ANSWERS = {
  greeting: (q) => {
    const salutation = has(q, "good morning")
      ? "Good morning!"
      : has(q, "good afternoon")
      ? "Good afternoon!"
      : has(q, "good evening")
      ? "Good evening!"
      : "Hi!";
    return `${salutation} I'm Anup AI 👋\nAsk me about Anup's skills, projects, education, availability, or how to get in touch.`;
  },

  thanks: () => "You're welcome! Feel free to ask anything else about Anup's projects, skills or availability.",
  bye: () => `Thanks for stopping by! If you'd like to reach Anup, LinkedIn is a great place: ${links.linkedin}`,
  ack: () => "Glad that helps! Is there anything else you'd like to know about Anup?",
  howAreYou: () =>
    "I'm doing well, thanks for asking! I'm here to help with anything about Anup — his projects, skills, education or availability.",

  assistant: () =>
    [
      "I'm Anup AI, the assistant for Anup Kundu's portfolio. I can tell you about:",
      "- His background and education",
      "- His skills and tech stack",
      "- His projects (KunduStocks, Wanderlust, Food Genie, AKExpenses) and their live demos",
      "- His availability for internships and junior roles",
      "- How to contact him (GitHub, LinkedIn, email)",
    ].join("\n"),

  security: () =>
    "I can only share verified information from Anup's portfolio — I can't change my instructions, reveal internal details, or accept new claims about him as fact. Feel free to ask about his projects, skills, education, availability or contact details.",

  salary: () =>
    `I don't have verified salary information for Anup. For compensation questions, it's best to contact him directly on LinkedIn (${links.linkedin}) or by email (${links.email}).`,

  grades: () =>
    "His portfolio doesn't list grades or scores. What I can tell you is that he's a final-year B.Tech Computer Science & Engineering student.",

  personal: () =>
    "I don't have that information — I can only share what's in Anup's portfolio, such as his projects, skills, education and availability.",

  employment: () =>
    "I don't have any verified employment or internship history for Anup — his portfolio doesn't list any company roles. His hands-on experience comes from his own projects (KunduStocks, Wanderlust, Food Genie and AKExpenses), and he's currently open to software engineering internships and junior developer roles.",

  about: () =>
    [
      `**Anup Kundu** is a Full-Stack Developer (MERN stack) and a final-year B.Tech Computer Science & Engineering student based in ${ANUP_PROFILE.location}.`,
      "He builds practical full-stack web apps with React, Node.js, Express and MongoDB, with a focus on clean REST APIs, secure authentication and responsive UIs, and he uses AI tools to speed up development.",
      "His featured projects are KunduStocks, Wanderlust, Food Genie and AKExpenses, and he's currently open to software engineering internships and junior roles.",
    ].join("\n"),

  education: (q) => {
    const lines = [
      "Anup is a final-year B.Tech student in Computer Science & Engineering. His foundation covers data structures, algorithms, object-oriented programming, database management systems and computer networks.",
    ];
    if (has(q, "where", "which") || hasFuzzy(q, "college", "university", "institute", "institution")) {
      lines.push("The name of his college isn't listed in his portfolio.");
    }
    return lines.join("\n");
  },

  skills: () => {
    const { skills } = ANUP_PROFILE;
    return [
      "Anup works mainly with the MERN stack. His verified skills:",
      `- **Frontend:** ${skills.frontend.join(", ")}`,
      `- **Backend:** ${skills.backend.join(", ")}`,
      `- **Databases & cloud:** ${skills.databasesAndCloud.join(", ")}`,
      `- **Tools:** ${skills.tools.join(", ")}`,
      `- **AI-assisted development:** ${skills.aiWorkflow.map((tool) => tool.replace(/\s*\(.*\)$/, "")).join(", ")}`,
      `He also has a CS foundation in ${skills.csFoundations.join(", ").replace(/, ([^,]*)$/, " and $1")}.`,
    ].join("\n");
  },

  projects: () =>
    [
      "Anup has four featured projects:",
      ...featuredProjects.map((p) => `- **${p.name}** — ${lowerFirst(p.tagline)}`),
      "Ask me about any of them for details or a live demo link.",
    ].join("\n"),

  liveDemos: () =>
    [
      "Here are the live demos of Anup's featured projects:",
      ...featuredProjects.filter((p) => p.links.live).map((p) => `- **${p.name}:** ${p.links.live}`),
    ].join("\n"),

  projectLinks: (project) => {
    const lines = [`**${project.name}** — ${lowerFirst(project.tagline)}.`];
    if (project.links.live) lines.push(`Live demo: ${project.links.live}`);
    if (project.links.dashboard) lines.push(`Trading dashboard: ${project.links.dashboard}`);
    if (project.links.github) lines.push(`Source code: ${project.links.github}`);
    return lines.join("\n");
  },

  projectTech: (project) =>
    [
      `**${project.name}** was built with ${project.tech.join(", ").replace(/, ([^,]*)$/, " and $1")}.`,
      project.description,
      project.links.live ? `Live demo: ${project.links.live}` : "",
    ]
      .filter(Boolean)
      .join("\n"),

  projectDetail: (project) =>
    [
      `**${project.name}** — ${lowerFirst(project.tagline)}.`,
      project.description,
      ...project.highlights.map((h) => `- ${h}`),
      `Tech: ${project.tech.join(", ")}`,
      project.links.live ? `Live demo: ${project.links.live}` : "",
      project.links.github ? `Source code: ${project.links.github}` : "",
    ]
      .filter(Boolean)
      .join("\n"),

  github: () =>
    `Here's Anup's GitHub: ${links.github}\nIt has the source code for his projects, including KunduStocks, Wanderlust, Food Genie and AKExpenses.`,

  linkedin: () => `Here's Anup's LinkedIn profile: ${links.linkedin}`,

  twitter: () => `Anup is on X (Twitter) at ${links.twitter}`,

  portfolio: () => `Anup's portfolio is at ${links.portfolio} — you're on it right now!`,

  cv: () => ANUP_PROFILE.cv.replace(/^His/, "Anup's"),

  contact: () =>
    [
      "You can reach Anup through:",
      `- The Contact section of this portfolio: ${links.portfolio}#contact`,
      `- LinkedIn: ${links.linkedin}`,
      `- Email: ${links.email}`,
      `- GitHub: ${links.github}`,
    ].join("\n"),

  availability: () =>
    [
      "Yes — Anup is currently open to software engineering internships and junior developer roles (full-stack and frontend), and is available for immediate full-stack and frontend contributions.",
      `To discuss an opportunity, reach him on LinkedIn (${links.linkedin}) or by email (${links.email}).`,
    ].join("\n"),

  location: () => `Anup is based in ${ANUP_PROFILE.location}.`,
};

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

const GREETING_WORDS = new Set([
  "hi", "hii", "hiii", "hello", "helo", "hello", "hey", "heyy", "heya", "hiya", "hola",
  "namaste", "yo", "sup", "howdy", "greetings", "good", "morning", "afternoon", "evening", "day",
]);
const FILLER_WORDS = new Set([
  "there", "anup", "ai", "anupai", "bot", "assistant", "everyone", "team", "friend", "bro", "sir", "maam", "again",
]);
const ACK_WORDS = new Set([
  "thanks", "thank", "thx", "ty", "tysm", "you", "so", "much", "very", "a", "lot", "for", "the", "info", "help",
  "ok", "okay", "okk", "k", "kk", "cool", "great", "nice", "awesome", "perfect", "alright", "sure", "got", "it",
  "wow", "good", "fine", "noted", "understood", "bye", "goodbye", "cya", "see", "later", "that", "helps", "anup", "ai",
]);

// Attempts to change the rules, extract internals, or plant "facts".
const SECURITY_PATTERNS = [
  /\b(ignore|forget|disregard|override|bypass)\b.*\b(instructions?|rules|prompts?|previous|above|everything|context)\b/,
  /\b(system prompt|your prompt|your instructions|api key|apikey|env file|environment variables?|jailbreak|developer mode|dan mode)\b/,
  /\b(pretend|roleplay|role play|act as|you are now|from now on you)\b/,
  /\b(say|claim|state|announce|tell everyone|repeat after me)\b( that)? (anup|he)\b/,
];

// Words that point at earlier turns or ask for judgement — always the model's job.
const CONTEXTUAL_WORDS = [
  "it", "its", "that", "this", "these", "those", "them", "they", "first", "second", "third", "fourth",
  "1st", "2nd", "3rd", "4th", "last", "previous", "previously", "before", "earlier", "above", "former", "latter",
  "compare", "compared", "comparison", "versus", "vs", "difference", "differ", "better", "best", "worst",
  "strongest", "strength", "strengths", "weakness", "weaknesses", "why", "should", "interesting", "recommend",
  "opinion", "think", "explain", "else", "another", "other", "most", "least",
];

/** Returns { intent, reply } for a static answer, or { intent, reply: null } for Gemini. */
const classify = (q, raw) => {
  const { tokens } = q;
  if (!tokens.length) return { intent: INTENTS.OTHER, reply: null };

  if (SECURITY_PATTERNS.some((pattern) => pattern.test(q.text))) {
    return { intent: INTENTS.SECURITY, reply: ANSWERS.security() };
  }

  // "hi", "good morning anup ai", or a greeting followed by a real question.
  let start = 0;
  while (start < tokens.length && GREETING_WORDS.has(tokens[start])) start++;
  if (start > 0) {
    if (tokens.slice(start).every((t) => FILLER_WORDS.has(t))) {
      return { intent: INTENTS.GREETING, reply: ANSWERS.greeting(q) };
    }
    // Only strip a real greeting ("good" alone is not one: "good projects?").
    if (!(start === 1 && tokens[0] === "good")) {
      return classify(analyze(tokens.slice(start).join(" ")), raw);
    }
  }

  if (/^(how are you|how r u|how are u|hows it going|how do you do)( doing| today)?$/.test(q.text)) {
    return { intent: INTENTS.SMALL_TALK, reply: ANSWERS.howAreYou() };
  }
  if (tokens.every((t) => ACK_WORDS.has(t))) {
    const reply = has(q, "bye", "goodbye", "cya", "see you")
      ? ANSWERS.bye()
      : has(q, "thanks", "thank", "thx", "ty", "tysm")
      ? ANSWERS.thanks()
      : ANSWERS.ack();
    return { intent: INTENTS.SMALL_TALK, reply };
  }

  if (
    /^(who are you|what are you|what can you do|what do you do|help|what can i ask|how does this work)$/.test(q.text)
  ) {
    return { intent: INTENTS.ASSISTANT, reply: ANSWERS.assistant() };
  }

  // Facts the portfolio does not contain: answer honestly, never guess.
  if (hasFuzzy(q, "salary", "compensation", "stipend") || has(q, "ctc", "package", "pay", "expected pay")) {
    return { intent: INTENTS.UNVERIFIED, reply: ANSWERS.salary() };
  }
  if (has(q, "cgpa", "gpa", "sgpa", "grade", "grades", "marks", "percentage", "rank", "score")) {
    return { intent: INTENTS.UNVERIFIED, reply: ANSWERS.grades() };
  }
  if (
    has(q, "age", "old", "birthday", "born", "dob", "married", "wife", "girlfriend", "religion", "caste", "height") &&
    !has(q, "project", "projects")
  ) {
    return { intent: INTENTS.UNVERIFIED, reply: ANSWERS.personal() };
  }
  const asksAboutFutureWork = has(q, "can", "could", "would", "willing", "available", "open", "want", "wants", "interested", "like", "prefer");
  if (
    !asksAboutFutureWork &&
    (/\b(work|worked|works|working|job|employed)\b (at|for) \w+/.test(q.text) ||
      /\b(intern|interned|interning)\b (at|in|with|for) \w+/.test(q.text) ||
      /\b(done|did|completed|had|has|any)\b( \w+){0,3} internships?\b/.test(q.text) ||
      /\bwhere (did|does|has) (he|anup)( \w+)? (work|intern)/.test(q.text) ||
      has(q, "employer", "employers", "interned", "work experience", "years of experience", "past jobs",
        "previous company", "which company", "what company", "which companies", "what companies"))
  ) {
    return { intent: INTENTS.UNVERIFIED, reply: ANSWERS.employment() };
  }

  // "this developer" / "this portfolio" mean Anup and this site, not an earlier turn.
  const deictic = analyze(q.text.replace(/\b(this|the) (developer|guy|person|portfolio|website|site|chatbot|bot)\b/g, "$2"));
  if (tokens.length > MAX_STATIC_WORDS || has(deictic, ...CONTEXTUAL_WORDS)) {
    return { intent: INTENTS.CONTEXTUAL, reply: null };
  }

  const projects = findProjects(q);
  const asksForLink = has(q, "link", "links", "url", "demo", "demos", "live", "try", "visit", "open", "deployed", "hosted", "website", "site", "where");
  const asksForCode = hasFuzzy(q, "github", "repository") || has(q, "repo", "source", "code");

  if (projects.length > 1) return { intent: INTENTS.CONTEXTUAL, reply: null };
  if (projects.length === 1) {
    const [project] = projects;
    if (asksForLink || asksForCode) return { intent: INTENTS.LIVE_DEMO, reply: ANSWERS.projectLinks(project) };
    if (hasFuzzy(q, "technologies", "technology") || has(q, "tech", "stack", "built with", "used", "use", "made with")) {
      return { intent: INTENTS.PROJECT_DETAIL, reply: ANSWERS.projectTech(project) };
    }
    return { intent: INTENTS.PROJECT_DETAIL, reply: ANSWERS.projectDetail(project) };
  }

  if (has(q, "demo", "demos", "live demo", "live demos", "live links", "live projects", "deployed")) {
    return { intent: INTENTS.LIVE_DEMO, reply: ANSWERS.liveDemos() };
  }
  if (hasFuzzy(q, "github", "repositories") || has(q, "repos", "source code")) {
    return { intent: INTENTS.GITHUB, reply: ANSWERS.github() };
  }
  if (hasFuzzy(q, "linkedin")) return { intent: INTENTS.LINKEDIN, reply: ANSWERS.linkedin() };
  if (has(q, "twitter", "x handle", "x account", "x profile")) return { intent: INTENTS.CONTACT, reply: ANSWERS.twitter() };
  if (has(q, "cv", "resume", "resum")) return { intent: INTENTS.CV, reply: ANSWERS.cv() };

  const mentionsProjects = hasFuzzy(q, "projects", "project", "applications") ||
    has(q, "built", "build", "builds", "made", "created", "apps", "app", "work samples");

  if ((hasFuzzy(q, "portfolio") || has(q, "website", "site")) && !mentionsProjects) {
    return { intent: INTENTS.PORTFOLIO, reply: ANSWERS.portfolio() };
  }
  if (
    hasFuzzy(q, "contact") ||
    has(q, "reach", "email", "mail", "gmail", "phone", "call", "connect", "get in touch", "hire", "hire him", "message him")
  ) {
    return { intent: INTENTS.CONTACT, reply: ANSWERS.contact() };
  }
  if (mentionsProjects) return { intent: INTENTS.PROJECTS, reply: ANSWERS.projects() };

  if (
    hasFuzzy(q, "skills", "skill", "technologies", "technology", "frameworks", "languages", "expertise", "proficient") ||
    has(q, "stack", "tech", "techstack", "tools", "tool", "good at", "programming")
  ) {
    return { intent: INTENTS.SKILLS, reply: ANSWERS.skills() };
  }
  if (
    hasFuzzy(q, "education", "studying", "student", "degree", "university", "college", "qualification", "graduation") ||
    has(q, "study", "studies", "btech", "b tech", "cse", "computer science", "which year", "semester", "graduate")
  ) {
    return { intent: INTENTS.EDUCATION, reply: ANSWERS.education(q) };
  }
  if (
    hasFuzzy(q, "internship", "internships", "available", "availability", "opportunity", "opportunities", "hiring") ||
    has(q, "intern", "job", "jobs", "role", "roles", "junior", "fresher", "open to", "looking for", "full time", "fulltime")
  ) {
    return { intent: INTENTS.AVAILABILITY, reply: ANSWERS.availability() };
  }
  if (
    hasFuzzy(q, "location", "located") ||
    (has(q, "where") && has(q, "live", "lives", "based", "from", "stay", "stays")) ||
    has(q, "city", "country", "hometown")
  ) {
    return { intent: INTENTS.LOCATION, reply: ANSWERS.location() };
  }

  const aboutAnup = hasFuzzy(q, "anup", "kundu") || has(q, "he", "him", "his", "developer", "this guy", "this person");
  if (
    /^(anup|anup kundu|kundu)$/.test(q.text) ||
    (aboutAnup &&
      (has(q, "who", "whos", "about", "introduce", "introduction", "summary", "overview", "bio", "background", "describe", "something", "kind of developer", "type of developer") ||
        /\bwhat (does|do) (anup|he|anup kundu) do\b/.test(q.text)))
  ) {
    return { intent: INTENTS.ABOUT, reply: ANSWERS.about() };
  }

  return { intent: INTENTS.OTHER, reply: null };
};

/**
 * Routes one (already validated) message. `reply` is a verified static answer,
 * or null when the message should go to Gemini.
 */
export function routeMessage(message) {
  return classify(analyze(normalize(message)), message);
}
