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
│   │   │   ├── cv/                          # Authenticated CV access feature
│   │   │   │   ├── CvAccessProvider.jsx     # Single shared CV flow state machine
│   │   │   │   ├── CvAccessButton.jsx       # Hero / navbar / mobile trigger variants
│   │   │   │   ├── CvAuthModal.jsx          # Sign in / sign up / granted / error states
│   │   │   │   └── PrivacyNotice.jsx        # What is collected and why
│   │   │   ├── navigation/                  # Navbar, Footer
│   │   │   └── ui/                          # 31 Radix / shadcn UI design primitives
│   │   ├── context/
│   │   │   └── AuthContext.jsx              # Session bootstrap, register/login/logout
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
│   │   ├── lib/                             # Utilities (cn helper, apiClient)
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
│   ├── private/                             # NEVER served statically; git-ignored
│   │   ├── README.md                        # Why this directory exists
│   │   └── Anup-Kundu-CV.pdf                # Reachable only via GET /api/cv
│   ├── scripts/
│   │   └── generate-placeholder-cv.js       # Creates a valid placeholder PDF
│   ├── src/
│   │   ├── config/                          # Configuration and environment loaders
│   │   │   ├── default.js                   # Env loading + startup validation
│   │   │   └── database.js                  # Single shared MongoDB Atlas connection
│   │   ├── controllers/                     # Request controllers
│   │   │   ├── contactController.js
│   │   │   ├── authController.js            # Register / login / logout / me
│   │   │   └── cvController.js              # CV ticket issuing + protected delivery
│   │   ├── middleware/                      # Express middleware
│   │   │   ├── authMiddleware.js            # Session verification, CV authorization
│   │   │   ├── rateLimiter.js               # Per-IP limits on auth and CV routes
│   │   │   ├── errorHandler.js              # Safe error mapping (no stack traces)
│   │   │   └── requestLogger.js
│   │   ├── models/
│   │   │   ├── User.js                      # Accounts (unique email index)
│   │   │   └── CvAccessLog.js               # CV access audit trail (180-day TTL)
│   │   ├── routes/                          # API route definitions
│   │   │   ├── apiRoutes.js
│   │   │   ├── contactRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── cvRoutes.js
│   │   ├── services/                        # Business logic layer
│   │   │   ├── contactService.js
│   │   │   └── authService.js               # bcrypt hashing, validation, access records
│   │   ├── utils/                           # Response formatting utilities
│   │   │   ├── responseHandler.js
│   │   │   ├── httpErrors.js                # Client-safe error factory
│   │   │   └── tokens.js                    # JWT signing/verification, cookie flags
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
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose](https://mongoosejs.com/)
- **Auth**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js) password hashing + [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) sessions in HTTP-only cookies
- **Utilities**: CORS allowlist, Dotenv, cookie-parser, express-rate-limit, Request Logger, Centralized Error Handling

---

## 🔐 Authenticated CV Access

The CV is the only gated resource on the site — every page and section stays fully
public and indexable.

**Flow:** *Download CV* (hero or navbar) → auth modal → sign up or sign in → the
backend verifies the session → the PDF opens in a new tab, with a download option.
An already-signed-in visitor skips the modal form entirely.

**How it is protected**

- Passwords are hashed with **bcrypt** (12 rounds). Plaintext is never stored or logged.
- The session is a JWT in an **HTTP-only cookie** (`SameSite=None; Secure` in production,
  because the Vercel frontend and Render backend are different sites). The SPA keeps a
  copy in memory only — never in `localStorage` — as a fallback for browsers that block
  cross-site cookies.
- `GET /api/cv` re-verifies the user against the database on **every** request. No
  frontend flag can grant access.
- The PDF is never a public asset. With `CV_SOURCE=proxy` (the default) the backend
  fetches it from a private Google Drive link and streams the bytes itself, so the
  browser never learns the upstream URL. With `CV_SOURCE=file` it is read from
  `backend/private/`, which no static middleware serves and which git ignores.
- New-tab navigation uses a short-lived (5 min) CV ticket, because a browser navigation
  cannot send an `Authorization` header. Session tokens and CV tickets use different JWT
  audiences, so neither can be replayed as the other.
- Auth and CV routes are rate-limited per IP.

**Data collected:** name, email, `authProvider`, `createdAt`, `lastLoginAt`,
`lastCvAccessAt`, and the timestamp of consent. Nothing else — no phone number, no
address, no date of birth, no IDs, no tracking. Consent is an explicit, un-pre-checked
checkbox, and the full privacy notice is reachable from the site footer.

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

# Copy the environment template and fill in real values
cp .env.example .env

# Generate a JWT signing secret and paste it into .env as JWT_SECRET
npm run secret

# Create a placeholder CV so GET /api/cv has something to serve
# (skip if you already placed the real PDF in backend/private/)
npm run cv:placeholder

# Start in development mode (with auto-reload)
npm run dev

# Or start in production mode
npm start
```

The backend server will be live at `http://localhost:5000/`.

#### Available Backend Endpoints

| Method | Path                 | Auth         | Purpose                                        |
| ------ | -------------------- | ------------ | ---------------------------------------------- |
| GET    | `/api/health`        | public       | Health check, service name, uptime, DB status  |
| POST   | `/api/contact`       | public       | Contact message submission                     |
| POST   | `/api/auth/register` | public       | Create an account (requires explicit consent)  |
| POST   | `/api/auth/login`    | public       | Sign in                                        |
| GET    | `/api/auth/me`       | optional     | Current session — always answers 200           |
| POST   | `/api/auth/logout`   | required     | Clear the session cookie                       |
| POST   | `/api/cv/ticket`     | required     | Issue a short-lived CV access ticket           |
| GET    | `/api/cv`            | **required** | Stream the protected CV — 401 if unauthorized  |

`GET /api/cv` accepts `?download=1` to force a download instead of inline viewing.

---

## 🔧 Environment Variables

Real `.env` files are git-ignored and must never be committed. See each
`.env.example` for the full, commented list.

### Frontend (`frontend/.env`)

Every `VITE_*` value is compiled into the public bundle — **never** put a secret here.

```env
VITE_APP_TITLE="Anup Kundu | Full Stack Developer"
VITE_API_BASE_URL="http://localhost:5000/api"
```

In Vercel, set `VITE_API_BASE_URL` to the deployed Render service URL plus `/api`.

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:8080
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<48+ random bytes, hex>
SESSION_TTL_DAYS=7
SESSION_COOKIE_NAME=pf_session
BCRYPT_ROUNDS=12

CV_SOURCE=file            # or "redirect"
CV_FILE_NAME=Anup-Kundu-CV.pdf
CV_DOWNLOAD_NAME=Anup-Kundu-CV.pdf
CV_EXTERNAL_URL=          # required only when CV_SOURCE=redirect
CV_TICKET_TTL_SECONDS=300
```

`JWT_SECRET` and `MONGODB_URI` are required — the server refuses to start in
production without them.

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
  - **Environment Variables**: `VITE_API_BASE_URL` → the Render service URL + `/api`
- **Backend**: Deploy `backend/` to [Render](https://render.com/), [Railway](https://railway.app/), or any Node.js host.
  - **Root Directory**: `backend`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Environment Variables**: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`,
    `ALLOWED_ORIGINS=https://anupportfolio2025.vercel.app`, plus the `CV_*` values.

### Deploying the CV file

`backend/private/` is git-ignored, so the PDF is **not** in the repository and will not
be present on a host that deploys from git. Pick a delivery mode with `CV_SOURCE`:

| `CV_SOURCE` | How the file is delivered | Browser learns the source URL? |
| --- | --- | --- |
| `proxy` *(default)* | The server fetches `CV_EXTERNAL_URL` (a Google Drive file share link) and streams the bytes back itself. Nothing needs to be on disk. | No |
| `file` | Streams `backend/private/<CV_FILE_NAME>`. Needs a persistent disk on the host, or a private repo with the PDF committed. | No |
| `redirect` | Answers `302` to `CV_EXTERNAL_URL`. Simplest, but once followed the visitor holds a shareable link that bypasses the gate. | Yes |

For `proxy` and `redirect`, the Drive file's sharing must be **"Anyone with the
link"** so the server can read it. Run `npm run cv:placeholder` to create a valid
local PDF for `file`-mode testing.

### Cross-site cookies

Because the frontend (Vercel) and backend (Render) are on different domains, the
session cookie is a third-party cookie. It is sent with `SameSite=None; Secure`, which
works in Chrome, Edge and Firefox. Safari's tracking prevention may still drop it — in
that case the visitor stays signed in for the current page view but must sign in again
after a reload. Putting the API on a subdomain of the site's own domain (for example
`api.anupkundu.dev`) removes that limitation entirely.
