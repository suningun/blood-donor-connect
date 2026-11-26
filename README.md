# Blood Donor Connect

A lightweight web app that connects blood donors with hospitals posting urgent requests in Cambodia. Built as a class prototype for INFO 251.

## Features

- Browse and filter blood requests by province and blood type
- Post detail pages with donor registration
- Donor and hospital accounts (register, login, logout)
- Hospital dashboard to create, update, and delete requests
- Donation info and blood compatibility reference

## Stack

- [Vite](https://vite.dev/) + vanilla JavaScript (ES modules, no framework)
- [Tailwind CSS v4](https://tailwindcss.com/) with a custom theme
- [Firebase](https://firebase.google.com/) Authentication and Firestore REST API
- [Lucide](https://lucide.dev/) icons

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/posts` | Blood requests list |
| `/post/:id` | Request detail |
| `/blood-info` | Donation and compatibility info |
| `/about` | About |
| `/contact` | Contact form |
| `/user-login`, `/user-register` | Donor auth |
| `/hospital-login`, `/hospital-register` | Hospital auth |
| `/hospital-dashboard` | Hospital request management |

Routing is client-side in `src/router.js`; links opt in with the `data-link` attribute.

## Project Structure

```
src/
  main.js          entry point
  router.js        client-side router
  firebase.js      Firebase project config and API base URLs
  style.css        Tailwind theme
  pages/           one module per route
  components/      header, footer, cards, filter bar
  services/        Firestore REST calls (posts, hospitals, messages, registrations)
  auth/            donor and hospital auth helpers
  data/            provinces, blood type compatibility
  utils/           icons, validation, Firestore field mapping
```

## Deployment (GitHub Pages)

The site deploys to `https://<user>.github.io/blood-donor-connect/` via GitHub Actions (`.github/workflows/deploy.yml`).

1. Add the Web3Forms key as a repository secret: **Settings → Secrets and variables → Actions → `EMAIL_PUBLIC_KEY`**.
2. **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`. The workflow builds and publishes `dist/`.
4. Add `<user>.github.io` to Firebase Authentication → Settings → Authorized domains.

Notes:

- `vite.config.js` uses the `/blood-donor-connect/` base for production builds and `/` for local dev.
- `src/utils/url.js` centralises `link()` / `stripBase()` so router links work under the Pages subpath.
- `public/404.html` restores deep links such as `/posts` after a refresh.

## Notes

- Firebase config lives in `src/firebase.js` and is committed for the prototype. Move it to environment variables before any real deployment and restrict the API key in the Firebase console.
- Auth state is kept in `localStorage` (`idToken`, `uid`, `role`).
- All donors, hospitals, and requests are synthetic data; this is not a real medical service.
