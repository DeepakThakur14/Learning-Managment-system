# LearnX LMS - Source Audit and Applied Fixes

## Scope
This package is based on the uploaded `LMS (3).zip`. The primary browser application is `Front-page/`; the backend is `backend/`.

## Applied fixes
1. Reordered `auth.js` before `mysql-bridge.js` on every Front-page HTML page where the order was reversed. The bridge replaces AuthService methods and must load after the base service.
2. Added the missing bridge methods used by the Admin Support Desk: `listUsers`, `listSupportIssues`, `createSupportIssue`, and `updateSupportIssue`.
3. Instructor self-registration now creates an active account rather than a pending account. On backend startup, older pending instructor accounts are activated to match this policy.
4. New course slugs receive a unique suffix to avoid a duplicate-slug database error when a course title is reused.
5. Root `index.html` now redirects to the actual app at `Front-page/pages/login.html`.
6. Removed the uploaded `.env` from the deliverable and sanitized `backend/.env.example`. The uploaded archive contained live-looking database credentials in both `.env` and `.env.example`; rotate the MySQL app-user password and JWT secret before using this package.
7. Kept the login/register/logout endpoints unthrottled as in the uploaded backend; the one-time initial-admin setup route still has a separate limit.

## Checks performed
- `node --check` passed for all 31 JavaScript files in the source package after the changes.
- Local asset reference scan found no missing local references in the primary `Front-page/` HTML pages.
- The legacy `LearnX/` and `LMSPROJECT(student-module).html/` folders contain old/incomplete pages and unresolved references. They are retained for source preservation, but the main app should be run from `Front-page/`.

## Known limitations - not represented as completed
- Assignment and quiz services in `Front-page/JS/services/` still use browser-side AppDB/localStorage. The current MySQL schema and API do not yet provide database-backed assignment, quiz, attempt, or submission endpoints. These records will not synchronize between devices yet.
- Dashboard charts and some metrics are still derived from seeded/local demo data; not all dashboard KPIs are live database aggregates.
- Browser + MySQL end-to-end testing was not possible in this static source audit. Validate login, course CRUD, support tickets and admin user provisioning on the user's local MySQL before replacing the backup.
