/**
 * Portfolio Projects Data Source
 * 
 * Clean, scannable data for software engineering recruiters.
 * Priority order:
 * 01 - KunduStocks (Stock Trading & Analytics Platform)
 * 02 - Wanderlust (Full-Stack Travel & Accommodation Platform)
 * 03 - Food Genie (AI-Assisted Food Ordering Platform)
 * 04 - AKExpenses (Roommate Expense & Settlement Tracker)
 */

export const PROJECT_CATEGORIES = [
  "All",
  "Full Stack",
  "React",
  "AI",
  "JavaScript",
  "Other",
];

export const PROJECTS_DATA = [
  {
    id: "kundustocks",
    number: "01",
    priority: 1,
    title: "KunduStocks",
    subtitle: "Stock Trading & Analytics Platform",
    badge: "Priority 01 • Flagship Platform",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description:
      "A full-stack equity trading and analytics platform inspired by Zerodha, featuring interactive candlestick charts, live market watchlists, portfolio tracking, and simulated order execution workflows.",
    highlights: [
      "Trading dashboard and simulated trade order tracking",
      "Interactive candlestick visualizers and portfolio holding analytics",
      "Market watchlist management and high-speed REST endpoints",
      "Modular full-stack MERN architecture with responsive UI",
    ],
    category: "Full Stack",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Recharts",
      "REST APIs",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/anupkundu2024/KunduStocks",
    liveUrl: "https://kundustocks-fronted.netlify.app/",
    dashboardUrl: "https://kundustocks-dashboard.netlify.app/",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=550&fit=crop",
    featured: true,
    status: "Live Platform",
    year: "2024",
  },
  {
    id: "wanderlust",
    number: "02",
    priority: 2,
    title: "Wanderlust",
    subtitle: "Full-Stack Travel & Accommodation Platform",
    badge: "Priority 02 • Live Deployed",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    description:
      "A full-stack travel and accommodation marketplace inspired by Airbnb, featuring dynamic property listings, full CRUD operations, user reviews, interactive map exploration, and secure authentication.",
    highlights: [
      "Dynamic property listings with full CRUD host workflows",
      "Secure user authentication and review rating calculations",
      "Interactive Mapbox location exploration and Cloudinary media storage",
      "Live cloud deployment on Render with MongoDB Atlas",
    ],
    category: "Full Stack",
    technologies: [
      "MongoDB",
      "Express.js",
      "React",
      "Node.js",
      "Cloudinary",
      "Mapbox",
      "REST APIs",
    ],
    githubUrl: "https://github.com/anupkundu2024/wanderlust-Project",
    liveUrl: "https://wanderlust-project-qduj.onrender.com/listings",
    dashboardUrl: null,
    image:
      "https://plus.unsplash.com/premium_photo-1684338795288-097525d127f0?q=80&w=2071&auto=format&fit=crop",
    featured: true,
    status: "Live Platform",
    year: "2024",
  },
  {
    id: "food-genie",
    number: "03",
    priority: 3,
    title: "Food Genie",
    subtitle: "AI-Assisted Food Ordering Platform",
    badge: "Priority 03 • In Development",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    description:
      "A modern food ordering web platform engineered with MERN architecture, dynamic menu exploration, and cart workflows, designed for planned AI-assisted culinary recommendations and dietary filtering.",
    highlights: [
      "Interactive menu exploration and cart management workflows",
      "Full-stack MERN scaffold with Express API health monitoring",
      "Modern responsive UI built with React and Tailwind CSS",
      "Structured for planned AI culinary recommendation models",
    ],
    category: "AI",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "AI / LLM API (Planned)",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/anupkundu2024/Food_Genie",
    liveUrl: "https://anup-food-genie.vercel.app/",
    dashboardUrl: null,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&h=550&fit=crop",
    featured: true,
    status: "In Development",
    year: "2025",
  },
  {
    id: "ak-expenses",
    number: "04",
    priority: 4,
    title: "AKExpenses",
    subtitle: "Roommate Expense & Settlement Tracker",
    badge: "Priority 04 • Expense Tracker",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description:
      "A practical roommate expense management web application built to split shared apartment costs, calculate transparent debt settlements, and provide role-based permissions with Clerk authentication.",
    highlights: [
      "Shared roommate expense splitting and balance calculations",
      "Automated debt simplification and settlement suggestion logic",
      "Role-based permissions (Admin & Roommate) with Clerk authentication",
      "Searchable monthly expense summaries and balance ledger",
    ],
    category: "Full Stack",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Clerk Auth",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/anupkundu2024/AK-Expense-tracker",
    liveUrl: "https://ak-expense-tracker.vercel.app/",
    dashboardUrl: null,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&h=550&fit=crop",
    featured: true,
    status: "Repository",
    year: "2025",
  },
  {
    id: "weather-dashboard",
    number: "05",
    title: "Weather Dashboard",
    subtitle: "Interactive Weather Forecast Application",
    description:
      "Interactive weather forecasting web application featuring location-based live forecast lookup, temperature and humidity metrics, multi-day forecasting, and responsive layout.",
    category: "React",
    technologies: [
      "React",
      "OpenWeather API",
      "Tailwind CSS",
      "JavaScript ES6+",
    ],
    githubUrl:
      "https://github.com/anupkundu2024/weather-app-react/tree/main/mini-project",
    liveUrl: "https://react-weather-app2025.netlify.app/",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
    featured: false,
    status: "Live",
    year: "2025",
  },
  {
    id: "portfolio-website",
    title: "3D Developer Portfolio",
    subtitle: "Interactive Three.js & Framer Motion Portfolio",
    description:
      "Personal developer portfolio built with React, Three.js 3D particles, Framer Motion animations, dark-mode glassmorphic styling, and accessible responsive structure.",
    category: "JavaScript",
    technologies: [
      "React",
      "Three.js",
      "Framer Motion",
      "Tailwind CSS",
      "Vite",
    ],
    githubUrl: "https://github.com/anupkundu2024/MyPortfolioSite",
    liveUrl: "https://anupportfolio2025.vercel.app/",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    featured: false,
    status: "Live",
    year: "2025",
  },
  {
    id: "dev-utilities-toolkit",
    title: "Open Source & Code Experiments",
    subtitle: "Algorithm Practice & Utility Tooling",
    description:
      "Collection of backend utility scripts, algorithmic solutions, React component experiments, and open-source contributions hosted on GitHub.",
    category: "Other",
    technologies: [
      "JavaScript ES6+",
      "Node.js",
      "Data Structures",
      "Algorithms",
      "Git",
    ],
    githubUrl: "https://github.com/anupkundu2024?tab=repositories",
    liveUrl: "https://github.com/anupkundu2024",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop",
    featured: false,
    status: "Active",
    year: "2024",
  },
];
