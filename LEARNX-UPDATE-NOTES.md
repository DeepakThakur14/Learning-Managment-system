# LearnX LMS update notes

## Changes in this update
- Removed the `/api/auth` request limiter so students and instructors can sign in/out repeatedly without the API returning 429 due to the former 30-per-15-minute auth limit. The one-time initial-admin setup endpoint retains its separate protection.
- Added MySQL-backed support tickets: students/instructors can submit issues and see their own tickets; admins can view all tickets, change status (Open / In Progress / Resolved), and write an admin response.
- Added admin account provisioning through the authenticated admin API, plus activate/disable and pending-instructor approval controls.
- Added the support form to student and instructor dashboards and the admin support desk to the admin dashboard.
- Fixed script order so `auth.js` loads before `mysql-bridge.js` on the affected role/login pages.

## Run locally (Windows PowerShell)
1. Copy your existing local `backend/.env` into this extracted project's `backend` folder. Do not upload `.env` to GitHub.
2. Open a terminal in `backend`: `npm.cmd install` then `npm.cmd start`.
3. Open `http://localhost:3000/api/health` and confirm `database: connected`.
4. Serve `Front-page` with VS Code Live Server and sign in as Admin, Student or Instructor.
5. Admin dashboard includes account creation and issue management. Student/instructor dashboards include “Need Help? Report an Issue”.

## Important security note
Authentication endpoints no longer have a request-rate limit, as requested. This means a public deployment has less protection against password-guessing attacks. Use strong passwords and keep the API behind HTTPS. The one-time initial-admin setup endpoint remains rate-limited and key-protected.

## Scope / testing
JavaScript syntax checks were run on the changed files. The package's external MySQL server and browser flows were not available in this build environment, so verify the workflows locally before replacing your old folder or deploying. Existing assignment/quiz screens may still contain legacy localStorage-only behavior; this update specifically makes account administration and support tickets server-backed and does not claim that all assignment/quiz CRUD has been migrated.
