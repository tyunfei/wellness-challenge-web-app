# Implementation notes and scope

This is a **portfolio adaptation of an individual coursework application**. The project structure, APIs, HTML pages and client-side scripts are preserved from the submitted source; only limited packaging corrections were made.

## What's implemented

- Node.js/Express HTTP server and static frontend (`index.js`, `src/app.js`, `public/`).
- MySQL connection pool and schema initialization with seven tables.
- Registration and login using bcrypt password hashing and JWT bearer tokens.
- Routes for challenges, challenge completions, coins/wallet, pets, and leaderboard.
- Frontend pages for authentication, dashboard, challenges and pets, with progress charts using Chart.js.

## Portfolio-specific changes

1. Removed the real `.env` and original `.git` history entirely, including from the published archive; added a placeholder-only `.env.example`.
2. Excluded the graded individual report, academic-integrity declaration, student-ID-labelled submission packaging, and any internal Git metadata.
3. Removed references to a missing `css/color.css` in all five HTML pages, preserving `css/style.css`.
4. Changed the undefined `connection.release()` error path in `src/configs/createSchema.js` to close the pool via `pool.end()`.
5. Updated package repository metadata and added this README and documentation.
6. The **coursework ERD image** remains in the prepared portfolio ZIP but is not yet uploaded to this repository; a conceptual schema overview appears in the README instead. Refer to `src/configs/initTables.js` for actual table definitions.

## Important limitations

- **Academic prototype, not production-ready.** JWT tokens are kept in browser `localStorage`, which can be exposed to injected JavaScript. A production deployment should review token storage, content security policy, and XSS protection.
- **Authorisation requires further auditing.** The presence of JWT checks does not guarantee that endpoints consistently enforce per-user resource ownership (e.g., updating users or equipping pets). Do not host this on the public internet with real users until tested and hardened.
- **Rewards and balances require transactional consistency review.** Multi-step operations may risk partial updates or concurrent double rewards without explicit transactions and idempotency safeguards.
- **Database initialisation is destructive.** `npm run init_tables` executes DROP TABLE statements before creating and seeding tables. Run only against a disposable local database.
- **MySQL connection and dependencies were not live-tested in portfolio packaging.** JavaScript syntax and file references were checked statically, but end-to-end behaviour requires a working MySQL server and local runtime.
- **Media rights.** Images are copied from the user's submitted application; provenance/licensing of individual artwork has not been independently verified. Confirm rights to redistribute before making the repository public.
- **Coursework sharing.** Confirm applicable module/institution publication rules before changing a new repository to Public.
- The original submitted ZIP contained a `.env` with credential values. Those values are **not included** in this package. If those credentials are still in use or appeared in any Git history, rotate them before publishing.

## Suggested future improvements

- Add automated API/integration tests and a dedicated test database.
- Add strong input validation, rate limiting, ownership checks and HTTPS-first deployment configuration.
- Make coin/point/XP changes atomic and protect against repeated reward claims.
- Replace hardcoded port with validated `PORT` configuration; test deployment.
- Audit dependency versions and image licences.
