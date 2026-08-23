# Portfolio Backend Service

Modular, clean, and lightweight Node.js/Express service for the portfolio site.

## Architecture

```
backend/
├── src/
│   ├── config/          # Configuration and environment loaders
│   ├── controllers/     # Controller logic handling requests
│   ├── middleware/      # Custom express middlewares (logging, error handling)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic and external service integrations
│   ├── utils/           # Helper functions and response formatters
│   └── server.js        # Express app initialization and server bootstrap
├── .env.example         # Example environment variables
├── package.json         # Backend dependencies and scripts
└── README.md
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact message submission endpoint

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```
