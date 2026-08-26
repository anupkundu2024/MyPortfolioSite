# `backend/private/` — protected files

Everything in this directory is reachable **only** through the authenticated
`GET /api/cv` endpoint. It is deliberately:

- **not** registered with `express.static()` or any other static middleware,
- **not** part of the frontend bundle (`frontend/public/` would be world-readable),
- **not** committed to git (see the `backend/private/*` rule in the root `.gitignore`).

## Expected contents

```
backend/private/
├── README.md              # tracked — keeps this path present after a fresh clone
└── Anup-Kundu-CV.pdf      # ignored — the actual CV, matching CV_FILE_NAME
```

The filename is read from `CV_FILE_NAME` in `backend/.env`.

## Why the CV is git-ignored

The portfolio repository is public. Anything committed here would be downloadable
from `raw.githubusercontent.com` without signing in, which would defeat the
authentication gate on `/api/cv`. So the file is kept out of version control.

## Consequence for deployment

Because the PDF is not in the repository, a host that deploys straight from git
(Render, Railway, Fly) will **not** have the file on disk. Pick one:

| Approach | `CV_SOURCE` | Notes |
| --- | --- | --- |
| Google Drive / S3 link | `redirect` | Recommended for a public repo. The URL lives in `CV_EXTERNAL_URL` server-side only; the authorization check still runs first. |
| Persistent disk | `file` | Mount a disk on the host and upload the PDF to it once. Requires a paid Render plan. |
| Private repository | `file` | If the repo is private, you may remove the ignore rule and commit the PDF. |

Local development always works with `CV_SOURCE=file` — just drop the PDF in this
directory.
