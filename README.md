# Secure Notes – Frontend

React client for the [Secure Notes API](https://github.com/Ashraf-Abid/secure-notes-backend). Users can register, log in and manage their own notes; admins can also manage users, browse everyone's notes and view the aggregation results.

- Live site: _to be added_
- Backend repository: https://github.com/Ashraf-Abid/secure-notes-backend

## Tech stack

React 19, TypeScript, Vite 6, React Router 6, Tailwind CSS 3, Axios.

## Getting started

Requires Node.js 18+ and the backend running locally (see the backend README).

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api` |

Other scripts: `npm run build` (type-check and build to `dist/`), `npm run preview` (serve the build).

## Pages

| Route | Access | Description |
|---|---|---|
| `/login`, `/register` | guests | Authentication |
| `/` | user | Dashboard with profile |
| `/notes` | user | Own notes with pagination, edit and delete |
| `/notes/new`, `/notes/:id/edit` | user | Create / edit a note |
| `/admin/users` | admin | List, create, edit and delete users |
| `/admin/notes` | admin | Everyone's notes, filterable by user |
| `/admin/aggregations` | admin | Users grouped by interests and posts of a user |

## Notes

- The JWT is kept in `localStorage` and sent as a `Bearer` token by an Axios interceptor. A `401` on a protected request clears the session and returns to the login page.
- Route guards only control what is shown. All permissions are enforced by the API.
- Page numbers and filters are stored in the URL, so refreshing or sharing a link keeps the current view.

## Deployment

Deployed on Vercel. `vercel.json` rewrites all routes to `index.html` so client-side routes work on refresh. Set `VITE_API_URL` to the deployed API URL in the Vercel project settings, and add the Vercel domain to the backend's `CLIENT_URL`.
