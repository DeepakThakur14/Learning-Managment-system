# LearnX LMS — Start Here

## Main application
The current primary LMS frontend is in `Front-page/`.
Open `Front-page/index.html` through a local static server (for example VS Code Live Server).
The legacy folders are retained from the supplied project; they have not been removed.

## Local backend setup
1. Install Node.js 20 or newer and MySQL 8.
2. Create a MySQL database named `learnx_lms`.
3. In `backend/`, copy `.env.example` to `.env`.
4. Set your own DB credentials and a random `JWT_SECRET` (at least 32 characters) in `.env`.
5. From the `backend/` directory run:
   - `npm install`
   - `npm run db:init`
   - `npm start`
6. Check `http://localhost:3000/api/health`. It should report `database: connected`.

PowerShell users may need `npm.cmd` instead of `npm`:
`npm.cmd install`, `npm.cmd run db:init`, `npm.cmd start`.

## Important deployment note
This package is configured for local API development (`http://localhost:3000`).
Cross-device access is NOT active until the backend and MySQL database are deployed to a publicly reachable host (for example Railway), the frontend API URL is set to that deployed HTTPS API URL, and `FRONTEND_ORIGINS` includes the exact Netlify site origin. A local MySQL database on your PC is not accessible to students on other devices.

## Security
Never commit `backend/.env`. The `.env.example` contains placeholders only. Keep passwords and JWT secrets private.
