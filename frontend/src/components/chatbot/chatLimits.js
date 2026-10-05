// Mirrors the backend limits in backend/src/controllers/chatController.js.
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_HISTORY_ITEMS = 12;
export const MAX_HISTORY_ITEM_LENGTH = 2000;
export const MAX_MESSAGES_IN_VIEW = 50;
// Generous enough for a cold-starting Render instance plus the backend's own
// 20 s Gemini deadline; the UI explains the wait after SLOW_HINT_MS.
export const REQUEST_TIMEOUT_MS = 60000;
export const SLOW_HINT_MS = 8000;
// Pause before the single automatic retry after a network failure.
export const NETWORK_RETRY_DELAY_MS = 1500;
