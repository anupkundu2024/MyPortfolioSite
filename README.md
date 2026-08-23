# Anup Kundu — Full Stack Developer Portfolio

A modern, high-performance developer portfolio showcasing full-stack software engineering projects, technical skills, interactive 3D particle animations, and developer journey.

The repository is organized into two completely self-contained and independently runnable applications: **`frontend/`** and **`backend/`**.

---

## 📁 Project Structure

```
MyPortfolioSite/
│
├── frontend/                                # Independent React 18 + Vite Application
│   ├── public/
│   │   └── favicon.svg                      # Site favicon
│   ├── src/
│   │   ├── assets/                          # Static assets and media
│   │   ├── components/                      # Reusable UI & navigation components
│   │   │   ├── common/                      # CursorGlow dynamic spotlight
│   │   │   ├── navigation/                  # Navbar, Footer
│   │   │   └── ui/                          # 31 Radix / shadcn UI design primitives
│   │   ├── sections/                        # Main portfolio sections
│   │   │   ├── Hero/                        # Hero banner, 3D particle canvas, RotatingBadge
│   │   │   ├── About/                       # About me, bio highlights, education
│   │   │   ├── Projects/                    # Featured projects, project explorer, cards, work
│   │   │   ├── Skills/                      # Technical categories and skills matrix
│   │   │   ├── Github/                      # GitHub activity calendar and stats
│   │   │   ├── Journey/                     # Developer milestones timeline
│   │   │   └── Contact/                     # Web3Forms contact form & direct channels
│   │   ├── pages/                           # Route views (Index.jsx, NotFound.jsx)
│   │   ├── hooks/                           # Custom React hooks (use-mobile, use-toast)
│   │   ├── lib/                             # Utilities (cn helper)
│   │   ├── data/                            # Centralized project data source (projects.js)
│   │   ├── App.jsx                          # Root App with QueryClient and Router
│   │   ├── App.css
│   │   ├── index.css                        # Tailwind base & glassmorphism classes
│   │   ├── main.jsx                         # React DOM entry point
│   │   └── vite-env.d.js
│   ├── index.html                           # Entry HTML & SEO metadata
│   ├── package.json                         # Frontend dependencies & scripts
│   ├── package-lock.json
│   ├── vite.config.js                       # Vite config with manual chunking & path alias
│   ├── tailwind.config.js                   # Tailwind CSS theme & animations
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── components.json                      # shadcn/ui configuration
│   └── .env.example
│
├── backend/                                 # Independent Node.js + Express API Service
│   ├── src/
│   │   ├── config/                          # Configuration and environment loaders
│   │   │   └── default.js
│   │   ├── controllers/                     # Request controllers
│   │   │   └── contactController.js
│   │   ├── middleware/                      # Express middleware (logger, error handler)
│   │   │   ├── errorHandler.js
│   │   │   └── requestLogger.js
│   │   ├── routes/                          # API route definitions
│   │   │   ├── apiRoutes.js
│   │   │   └── contactRoutes.js
│   │   ├── services/                        # Business logic layer
│   │   │   └── contactService.js
│   │   ├── utils/                           # Response formatting utilities
│   │   │   └── responseHandler.js
│   │   └── server.js                        # Express server entry point
│   ├── package.json                         # Backend dependencies & scripts
│   ├── package-lock.json
│   ├── .env.example
│   └── README.md
│
├── .gitignore                               # Project-wide gitignore rules
└── README.md                                # Project documentation
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS + CSS Variables
- **UI Components & Icons**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI Primitives) + [Lucide React](https://lucide.dev/)
- **Animations & 3D**: [Framer Motion](https://www.framer.com/motion/) + [Three.js](https://threejs.org/) / [@react-three/fiber](https://r3f.docs.pmnd.rs/) / [@react-three/drei](https://github.com/pmndrs/drei)
- **Forms & Notifications**: [React Hook Form](https://react-hook-form.com/) + [Sonner](https://sonner.emilkowal.ski/) + Web3Forms API
- **Routing & State**: [React Router DOM v6](https://reactrouter.com/) + [@tanstack/react-query](https://tanstack.com/query/latest)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/)
- **Utilities**: CORS, Dotenv, Request Logger, Centralized Error Handling

---

## ⚙️ Getting Started

### 1. Frontend Setup & Run

The frontend is completely self-contained in the `frontend/` directory.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will be live at `http://localhost:8080/`.

#### Available Frontend Scripts
- `npm run dev`: Starts the local Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles the optimized production bundle into `frontend/dist/`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint checks on the frontend code.

---

### 2. Backend Setup & Run

The backend is completely self-contained in the `backend/` directory.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start in development mode (with auto-reload)
npm run dev

# Or start in production mode
npm start
```

The backend server will be live at `http://localhost:5000/`.

#### Available Backend Endpoints
- `GET /api/health`: Health check endpoint (returns system status, service name, and uptime).
- `POST /api/contact`: Form submission endpoint for receiving contact messages.

---

## 🔧 Environment Variables

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_APP_TITLE="Anup Kundu | Full Stack Developer"
VITE_API_BASE_URL="http://localhost:5000/api"
```

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:8080
```

---

## 📦 Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

The production output is generated in `frontend/dist/` with code-split vendor chunks (React, Three.js, Framer Motion, Icons) for maximum performance and caching.

---

## 🌐 Deployment

- **Frontend**: Deploy `frontend/` to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
  - **Root Directory / Base Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
- **Backend**: Deploy `backend/` to [Render](https://render.com/), [Railway](https://railway.app/), or any Node.js host.
  - **Root Directory**: `backend`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
