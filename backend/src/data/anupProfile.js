/**
 * Verified knowledge base for the "Anup AI" portfolio assistant.
 *
 * This is the chatbot's single source of truth. Every fact here is taken from
 * the published portfolio (frontend/src/data/projects.js and the About, Skills,
 * Journey, Contact and Footer sections). Nothing may be added that the
 * portfolio itself does not state — the assistant is instructed to treat this
 * as the only thing it knows, so an invented fact here becomes a confident
 * wrong answer to a recruiter.
 *
 * When the portfolio changes, update this file in the same commit.
 * It is server-controlled: no API route can read or modify it directly.
 */

export const ANUP_PROFILE = Object.freeze({
  name: "Anup Kundu",
  role: "Full-Stack Developer (MERN stack)",
  education: "Final-year B.Tech student in Computer Science & Engineering",
  location: "Kolkata, West Bengal, India",
  summary:
    "Full-stack developer and final-year Computer Science & Engineering student who builds practical web applications with the MERN stack (MongoDB, Express.js, React, Node.js) and uses AI tools to speed up development. Focus areas: modular backend architecture, clean REST APIs, secure authentication, and responsive, mobile-first user interfaces.",

  availability:
    "Open to software engineering internships and junior developer roles (full-stack and frontend). Available for immediate full-stack and frontend contributions.",

  skills: {
    frontend: ["React", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 & semantic, accessible UI", "CSS3 & animations", "Vite", "Material UI", "Framer Motion", "Three.js"],
    backend: ["Node.js", "Express.js", "Python", "RESTful API design", "JWT and Clerk authentication", "MVC architecture"],
    databasesAndCloud: ["MongoDB", "Mongoose ODM", "MySQL", "Vercel", "Netlify", "Render"],
    tools: ["Git & GitHub", "Postman", "Figma", "VS Code"],
    aiWorkflow: [
      "Cursor (AI-powered IDE)",
      "GitHub Copilot (code assistance)",
      "Claude (architecture and logic)",
      "ChatGPT (debugging and ideation)",
      "Gemini (research and documentation)",
      "n8n (workflow automation)",
    ],
    csFoundations: ["Data Structures", "Algorithms", "Object-Oriented Programming", "Database Management Systems", "Computer Networks"],
  },

  journey: [
    "Foundations: core CS fundamentals — data structures, algorithms, OOP, DBMS, computer networks, and Git.",
    "Full-stack development: built KunduStocks, Wanderlust and AKExpenses with React, Node.js, Express and MongoDB.",
    "AI tools & cloud: uses Cursor, Copilot and Claude to accelerate coding, debugging and documentation; deploys on Vercel, Netlify and Render; started Food Genie.",
    "Present: final year, actively seeking software engineering internships and junior roles.",
  ],

  featuredProjects: [
    {
      name: "KunduStocks",
      aliases: ["kundu stocks", "kundustocks", "stock", "trading"],
      tagline: "Stock trading & analytics platform (flagship project)",
      description:
        "Full-stack equity trading and analytics platform inspired by Zerodha, with interactive candlestick charts, market watchlists, portfolio tracking and simulated order execution.",
      highlights: [
        "Trading dashboard with simulated trade order tracking",
        "Interactive candlestick charts and portfolio holding analytics",
        "Market watchlist management backed by REST endpoints",
        "Modular MERN architecture with a responsive UI",
      ],
      tech: ["React", "Node.js", "Express.js", "MongoDB", "Recharts", "REST APIs", "Tailwind CSS"],
      status: "Live",
      year: "2024",
      links: {
        live: "https://kundustocks-fronted.netlify.app/",
        dashboard: "https://kundustocks-dashboard.netlify.app/",
        github: "https://github.com/anupkundu2024/KunduStocks",
      },
    },
    {
      name: "Wanderlust",
      aliases: ["wanderlust", "wander lust", "airbnb", "travel", "accommodation"],
      tagline: "Full-stack travel & accommodation platform",
      description:
        "Travel and accommodation marketplace inspired by Airbnb, with dynamic property listings, full CRUD for hosts, user reviews and ratings, interactive map exploration and secure authentication.",
      highlights: [
        "Property listings with full create/read/update/delete workflows",
        "Secure user authentication and review ratings",
        "Interactive Mapbox location maps and Cloudinary image storage",
        "Deployed on Render with MongoDB Atlas",
      ],
      tech: ["MongoDB", "Express.js", "React", "Node.js", "Cloudinary", "Mapbox", "REST APIs"],
      status: "Live",
      year: "2024",
      links: {
        live: "https://wanderlust-project-qduj.onrender.com/listings",
        github: "https://github.com/anupkundu2024/wanderlust-Project",
      },
    },
    {
      name: "Food Genie",
      aliases: ["food genie", "foodgenie", "food_genie", "food"],
      tagline: "AI-assisted food ordering platform (in development)",
      description:
        "Food ordering web platform built on the MERN stack with menu exploration and cart workflows. AI-assisted recommendations and dietary filtering are PLANNED, not yet built.",
      highlights: [
        "Interactive menu exploration and cart management",
        "MERN scaffold with an Express API health check",
        "Responsive UI with React and Tailwind CSS",
        "Structured for planned AI food recommendations",
      ],
      tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "AI / LLM API (planned)"],
      status: "In development",
      year: "2025",
      links: {
        live: "https://anup-food-genie.vercel.app/",
        github: "https://github.com/anupkundu2024/Food_Genie",
      },
    },
    {
      name: "AKExpenses",
      aliases: ["akexpenses", "ak expenses", "ak-expense", "expense", "roommate"],
      tagline: "Roommate expense & settlement tracker",
      description:
        "Web app for splitting shared apartment costs between roommates, calculating settlements, with role-based permissions (Admin and Roommate) using Clerk authentication.",
      highlights: [
        "Shared expense splitting and balance calculations",
        "Debt simplification and settlement suggestions",
        "Role-based access (Admin & Roommate) with Clerk authentication",
        "Searchable monthly expense summaries and a balance ledger",
      ],
      tech: ["React", "Node.js", "Express.js", "MongoDB", "Clerk Auth", "Tailwind CSS"],
      year: "2025",
      links: {
        live: "https://ak-expense-tracker.vercel.app/",
        github: "https://github.com/anupkundu2024/AK-Expense-tracker",
      },
    },
  ],

  otherProjects: [
    {
      name: "Weather Dashboard",
      description: "React weather app with location-based live forecasts, temperature/humidity metrics and multi-day forecasts (OpenWeather API).",
      links: {
        live: "https://react-weather-app2025.netlify.app/",
        github: "https://github.com/anupkundu2024/weather-app-react/tree/main/mini-project",
      },
    },
    {
      name: "3D Developer Portfolio (this website)",
      description: "React + Vite portfolio with a Three.js particle background, Framer Motion animations and Tailwind CSS.",
      links: {
        live: "https://anupportfolio2025.vercel.app/",
        github: "https://github.com/anupkundu2024/MyPortfolioSite",
      },
    },
  ],

  links: {
    portfolio: "https://anupportfolio2025.vercel.app/",
    github: "https://github.com/anupkundu2024",
    linkedin: "https://www.linkedin.com/in/anupkundu-linkdin/",
    twitter: "https://x.com/anupkundu_",
    email: "anupbubay9986@gmail.com",
  },

  contact:
    "Best ways to reach Anup: the Contact section of the portfolio (https://anupportfolio2025.vercel.app/#contact), LinkedIn (https://www.linkedin.com/in/anupkundu-linkdin/) or email (anupbubay9986@gmail.com).",
});

/**
 * Compact plain-text rendering of the profile for the model prompt. Kept short
 * on purpose: it is sent with every request, so every line costs tokens.
 */
export function buildKnowledgeText(profile = ANUP_PROFILE) {
  const list = (items) => items.join(", ");
  const project = (p) =>
    [
      `### ${p.name} — ${p.tagline}`,
      p.description,
      ...(p.highlights || []).map((h) => `- ${h}`),
      p.tech ? `Tech: ${list(p.tech)}` : "",
      p.status ? `Status: ${p.status}${p.year ? ` (${p.year})` : ""}` : "",
      ...Object.entries(p.links).map(([kind, url]) => `${kind}: ${url}`),
    ]
      .filter(Boolean)
      .join("\n");

  return [
    `Name: ${profile.name}`,
    `Role: ${profile.role}`,
    `Education: ${profile.education}`,
    `Location: ${profile.location}`,
    `Summary: ${profile.summary}`,
    `Availability: ${profile.availability}`,
    "",
    "## Skills",
    `Frontend: ${list(profile.skills.frontend)}`,
    `Backend: ${list(profile.skills.backend)}`,
    `Databases & cloud: ${list(profile.skills.databasesAndCloud)}`,
    `Tools: ${list(profile.skills.tools)}`,
    `AI-assisted workflow: ${list(profile.skills.aiWorkflow)}`,
    `CS foundations: ${list(profile.skills.csFoundations)}`,
    "",
    "## Journey",
    ...profile.journey.map((step) => `- ${step}`),
    "",
    "## Featured projects (in priority order)",
    ...profile.featuredProjects.map(project),
    "",
    "## Other projects",
    ...profile.otherProjects.map(
      (p) => `- ${p.name}: ${p.description} ${Object.entries(p.links).map(([k, u]) => `${k}: ${u}`).join(" | ")}`
    ),
    "",
    "## Links & contact",
    ...Object.entries(profile.links).map(([kind, value]) => `${kind}: ${value}`),
    profile.contact,
  ].join("\n");
}
