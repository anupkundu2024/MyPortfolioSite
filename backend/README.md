# Portfolio Backend Service

Modular, clean, and lightweight Node.js/Express service for the portfolio site.

## Architecture

```
backend/
├── private/                     # NOT served statically — protected files only
│   └── Anup-Kundu-CV.pdf        # Reachable only through GET /api/cv
├── scripts/
│   └── generate-placeholder-cv.js
├── src/
│   ├── config/
│   │   ├── default.js           # Environment loading + startup validation
│   │   └── database.js          # Single shared MongoDB Atlas connection
│   ├── controllers/
│   │   ├── contactController.js
│   │   ├── authController.js    # Register / login / logout / me
│   │   └── cvController.js      # CV ticket issuing + protected file delivery
│   ├── middleware/
│   │   ├── authMiddleware.js    # Session verification, CV authorization
│   │   ├── rateLimiter.js       # Per-IP limits on auth and CV routes
│   │   ├── errorHandler.js      # Safe error mapping (no stack traces leak)
│   │   └── requestLogger.js
│   ├── models/
│   │   ├── User.js              # Accounts (unique email index)
│   │   └── CvAccessLog.js       # CV access audit trail (180-day TTL)
│   ├── routes/
│   │   ├── apiRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── authRoutes.js
│   │   └── cvRoutes.js
│   ├── services/
│   │   ├── contactService.js
│   │   └── authService.js       # bcrypt hashing, validation, access recording
│   ├── utils/
│   │   ├── responseHandler.js
│   │   ├── httpErrors.js        # Client-safe error factory
│   │   ├── redactUrl.js         # Keeps CV tickets out of the logs
│   │   └── tokens.js            # JWT signing/verification, cookie flags
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

| Method | Path               | Auth        | Purpose                                       |
| ------ | ------------------ | ----------- | --------------------------------------------- |
| GET    | `/api/health`      | public      | Health check, includes database status        |
| POST   | `/api/contact`     | public      | Contact message submission                    |
| POST   | `/api/auth/register` | public    | Create an account (requires explicit consent) |
| POST   | `/api/auth/login`  | public      | Sign in                                       |
| GET    | `/api/auth/me`     | optional    | Current session — always 200                  |
| POST   | `/api/auth/logout` | required    | Clear the session cookie                      |
| POST   | `/api/cv/ticket`   | required    | Issue a short-lived CV access ticket          |
| GET    | `/api/cv`          | **required** | Stream the protected CV (401 if unauthorized) |

`GET /api/cv` accepts `?download=1` to force a download instead of inline viewing.

## Authentication model

- Passwords are hashed with **bcrypt** (12 rounds). Plaintext is never stored or logged.
- The session is a JWT delivered in an **HTTP-only cookie** (`SameSite=None; Secure` in
  production, since the Vercel frontend and Render backend are different sites).
- The same token is also returned in the response body. The SPA keeps that copy **in memory
  only** — never in `localStorage` — as a fallback for browsers that block cross-site cookies.
- `GET /api/cv` additionally accepts a short-lived `?ticket=` token, because a new-tab
  navigation cannot send an `Authorization` header. Session tokens and CV tickets use
  different JWT audiences, so neither can be replayed as the other.
- Every protected request re-checks the database, so a deleted account loses access at once.

## CV storage

Three delivery modes are available via `CV_SOURCE`. **All of them run after the
authorization check** — an unauthenticated request never reaches any of this code.

| `CV_SOURCE` | Behaviour | Browser learns the source URL? |
| --- | --- | --- |
| `proxy` | The server fetches `CV_EXTERNAL_URL` and streams the bytes back itself. | No |
| `file` | Streams `backend/private/<CV_FILE_NAME>` from disk. | No |
| `redirect` | Answers `302` to `CV_EXTERNAL_URL`. | Yes |

`proxy` is the default for this deployment. It keeps the Google Drive URL entirely
server-side, so the only way to reach the PDF is through an authenticated request
to this API. If the upstream host answers with something that is not a PDF (for
example Google's "confirm download" interstitial), the request falls back to a
redirect so the visitor still receives the file.

`redirect` is simpler but weaker: once the browser has followed the redirect, the
visitor has the raw Drive URL and can share it, bypassing the gate permanently.
Only use it if that is acceptable.

For `proxy` and `redirect`, the Drive file's sharing must be set to **"Anyone with
the link"** — otherwise the server itself cannot read it.

### About `backend/private/`

The directory is **not** exposed through any static middleware and is not part of
the frontend bundle. It is also git-ignored (see the root `.gitignore`), because
anything committed there would be downloadable from `raw.githubusercontent.com`
on a public repository, which would bypass this API entirely. Run
`npm run cv:placeholder` to generate a valid PDF there for local `file`-mode testing.

## Development

```bash
# Install dependencies
npm install

# Copy the environment template and fill in real values
cp .env.example .env

# Run in development mode
npm run dev

# Run in production mode
npm start
```

See `.env.example` for every supported variable. `JWT_SECRET` and `MONGODB_URI` are
required — the server refuses to start in production without them.
