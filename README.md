# Bridge — Frontend

Next.js (App Router) frontend for the Professional Networking Platform,
wired to the FastAPI/MongoDB backend.

## Setup

1. **Make sure the backend is running first** (see `../backend/README.md`).
   By default it should be live at `http://localhost:8000`.

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure the API URL:**
   ```bash
   cp .env.local.example .env.local
   ```
   The default (`http://localhost:8000`) works if the backend is running
   locally on its default port.

4. **Run the dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## What's implemented

- **Auth**: signup (choose job seeker / employer), login, persisted session
- **Dashboard**: recommended jobs (job seekers, scored by skill match) or
  recent listings (employers)
- **Job board**: search/filter, job detail page, apply flow, employer
  application review with status updates
- **Profile**: edit profile fields, add/remove skills with proficiency +
  years of experience, public profile view
- **Network**: send/accept/decline connection requests
- **Messages**: conversation list + threaded messaging

## Design

Built around the one thing unique to this product: the skill-match
percentage. Every job card shows a small radial "match ring" — this is the
signature visual element the rest of the design stays quiet around.

- **Colors**: cool paper background, deep navy ink, indigo for actions,
  amber reserved for the match ring / highlights, signal green for
  positive states (open to work, accepted).
- **Type**: Fraunces (display) + Inter (body) + IBM Plex Mono (data — match
  percentages, salaries, IDs).

## Notes / what's simplified

- **Connections and messaging currently require pasting a raw user ID** —
  there's no user search/directory yet. A `GET /api/users/search` endpoint
  plus a picker UI would be the natural next addition.
- **File uploads** (resume, profile photo) aren't wired up — the backend
  schema takes a URL string for these fields, so hooking up actual storage
  (S3, Cloudinary, etc.) is a separate step.
- No dedicated pages for `portfolio_items` or `notifications` yet (backend
  models exist for the former; routes for both are not yet built either —
  see the backend README).
