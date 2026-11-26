# Blood Donor Connect

A lightweight web app that connects blood donors with hospitals posting urgent requests in Cambodia. Built as a class prototype for INFO 251 — all donors, hospitals, and requests are synthetic data, not a real medical service.

## Features

- Browse active blood requests and filter by province and blood type
- Request detail pages with donor registration (one registration per donor per request)
- Donor sign-up with eligibility validation (age 18–65, weight ≥ 50 kg, health declaration)
- Hospital accounts with a dashboard to create, close, and delete requests and view registrants
- Donation info page: eligibility rules, blood-type compatibility, before/during/after tips, FAQ
- Contact form delivered by email through Web3Forms
- Responsive layout with mobile navigation and reduced-motion-aware animations
- Client-side routing that works under a GitHub Pages subpath

## Stack

- [Vite 7](https://vite.dev/) + vanilla JavaScript (ES modules, no framework)
- [Tailwind CSS v4](https://tailwindcss.com/) with a custom theme (`src/style.css`)
- [Firebase](https://firebase.google.com/) Authentication and Cloud Firestore via REST
- [Web3Forms](https://web3forms.com/) for contact-form email delivery
- [Lucide](https://lucide.dev/) icons
- GitHub Actions + GitHub Pages for deployment

## Getting Started

```bash
npm install
```

Create `.env` in the project root:

```bash
EMAIL_PUBLIC_KEY=your_web3forms_access_key
```

Then:

```bash
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build
```

The contact form needs `EMAIL_PUBLIC_KEY`; every other feature works without it.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `EMAIL_PUBLIC_KEY` | For contact form | Web3Forms access key. Injected at build time; exposed to the browser by design. |

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/posts` | Blood requests list |
| `/post/:id` | Request detail and donor registration |
| `/blood-info` | Donation and compatibility info |
| `/about` | About |
| `/contact` | Contact form |
| `/user-login`, `/user-register` | Donor auth |
| `/hospital-login`, `/hospital-register` | Hospital auth |
| `/hospital-dashboard` | Hospital request management |

Routing is client-side in `src/router.js`; in-app links use `data-link` and the `link()` helper from `src/utils/url.js`.

## Eligibility Rules

Thresholds live in `src/data/eligibility.js` and are shared by the donation info page and donor sign-up, so the two cannot drift apart:

- Age 18–65
- Weight at least 50 kg
- Good general health, not pregnant or recently ill
- At least 3 months since the last whole-blood donation

## Project Structure

```
src/
  main.js            entry point, restores deep links after a 404 redirect
  router.js          client-side router (base-path aware)
  firebase.js        Firebase project config and API base URLs
  style.css          Tailwind theme and fonts
  pages/             one module per route
  components/        header, footer, post card, password field, registrant list
  services/          REST calls (posts, hospitals, users, registrations, messages)
  auth/              donor and hospital auth helpers, account-role checks
  data/              provinces, blood compatibility, eligibility rules
  utils/             url helpers, icons, styles, motion, validation, Firestore mapping
public/
  404.html           GitHub Pages deep-link fallback
.github/workflows/   Pages deployment workflow
```

Firestore collections used: `posts`, `users`, `hospitals`, `registrations`. Contact messages are emailed through Web3Forms and are not stored in Firestore.

## Deployment (GitHub Pages)

The site deploys to `https://suningun.github.io/blood-donor-connect/` via GitHub Actions (`.github/workflows/deploy.yml`).

1. Add the Web3Forms key as a repository secret: **Settings → Secrets and variables → Actions → `EMAIL_PUBLIC_KEY`**.
2. **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`. The workflow runs `npm ci`, builds, and publishes `dist/`.
4. Add `suningun.github.io` to Firebase Authentication → Settings → Authorized domains.

Notes:

- `vite.config.js` uses the `/blood-donor-connect/` base for production builds and `/` for local dev.
- `src/utils/url.js` centralises `link()` / `stripBase()` so links and routes work under the Pages subpath.
- `public/404.html` restores deep links such as `/posts` after a refresh.

## Notes

- Firebase config lives in `src/firebase.js` and is committed for the prototype. Move it to environment variables and restrict the API key in the Firebase console before any real deployment.
- Auth state is kept in `localStorage` (`idToken`, `uid`, `role`).
- `EMAIL_PUBLIC_KEY` is public by nature (browser-side form key); restrict it in the Web3Forms dashboard if needed.
