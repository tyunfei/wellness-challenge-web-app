# Railway deployment of the Wellness Challenge demo

This site requires an Express web service and a persistent MySQL database. GitHub Pages cannot host its backend.

## Create services

1. Sign in to https://railway.com and create a project.
2. Choose Deploy from GitHub repo and select https://github.com/tyunfei/wellness-challenge-web-app, branch main.
3. Use npm ci as build command and npm start as start command.
4. Add a MySQL database in the SAME Railway project via + New -> Database -> MySQL. Keep the database PRIVATE; no public TCP proxy is needed.

## Configure web service variables

Open the WEB service -> Variables and enter these values. The first five are Railway references to the MySQL service; replace the MySQL prefix if you gave that service a different name.

| Variable | Value |
|---|---|
| DB_HOST | ${{MySQL.MYSQLHOST}} |
| DB_PORT | ${{MySQL.MYSQLPORT}} |
| DB_USER | ${{MySQL.MYSQLUSER}} |
| DB_PASSWORD | ${{MySQL.MYSQLPASSWORD}} |
| DB_DATABASE | ${{MySQL.MYSQLDATABASE}} |
| NODE_ENV | production |
| JWT_SECRET_KEY | Your NEW random secret, at least 32 characters |
| JWT_EXPIRES_IN | 1h |
| JWT_ALGORITHM | HS256 |
| DEMO_AUTO_INIT | true |

Do not send or publish your real database password or JWT secret. Enter them directly in Railway private variables. Railway automatically provides PORT.

## Non-destructive first-run setup

The optional DEMO_AUTO_INIT=true setting runs a safe setup at startup. It only creates the seven tables and synthetic seed records if the selected database is completely empty. If all seven tables exist, it does nothing. If the database is partially populated, it refuses to run instead of deleting data.

IMPORTANT: The original coursework npm run init_tables command drops and recreates tables. NEVER use it on a hosted database you need to preserve.

After a successful first setup you may change DEMO_AUTO_INIT to false.

## Verify live functionality

1. Check Railway deployment logs. Set the web service Healthcheck Path to /healthz; HTTP 200 indicates MySQL is reachable.
2. Generate the web service HTTPS domain under Settings -> Networking -> Generate Domain.
3. Verify page styling, navigation, registration/login with disposable demo credentials, challenge completion, coins, leaderboard and pet adoption/equipping.
4. Test logout and confirm protected API endpoints reject requests without authentication.
5. Check application logs for unexpected errors. Do not share credentials in screenshots or bug reports.

A live MySQL integration test is still required. The repository includes syntax and local asset checks, NOT a production security audit.

## Share on LinkedIn

After verification, add the public HTTPS URL under Profile -> Add profile section -> Featured -> Add a link, and optionally Contact info -> Website. You can also add it to GitHub repository About -> Website.

## Warnings

- This is an academic prototype, not a production-hardened service. Do not collect sensitive or real user data. Use demo accounts and passwords never reused elsewhere.
- JWT tokens are stored in localStorage; some reward operations remain non-transactional. More hardening and testing are needed before inviting broad public use.
- Verify permission to republish coursework material and the pet images.
- Railway usage-based charges may apply. Monitor the usage dashboard and https://railway.com/pricing.
