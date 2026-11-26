# LearnX LMS - Start Here

The primary app is in `Front-page/`. The API is in `backend/`.

## Local setup
1. Install MySQL and create the database `learnx_lms`.
2. In `backend/`, copy `.env.example` to `.env`.
3. Set DB credentials and a random `JWT_SECRET` of at least 32 characters in `.env`.
4. In a terminal opened at `backend/`, run `npm.cmd install`, then `npm.cmd run db:init`, then `npm.cmd start`.
5. Open `Front-page/index.html` using VS Code Live Server (typically `http://127.0.0.1:5500/Front-page/`).
6. Verify `http://localhost:3000/api/health` returns `database: connected`.

Never commit or share `backend/.env`. If credentials were included in an earlier ZIP, rotate them.

See `PROJECT_AUDIT.md` for applied fixes, checks, and known feature gaps.
