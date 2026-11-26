# LearnX LMS — Online MySQL backend

This package changes LearnX from browser-only LocalStorage/Supabase code to a shared MySQL database accessed through a Node.js/Express API. Browser code never receives the MySQL password.

## What is included

- `Front-page/`: updated existing LearnX frontend, retaining its current pages and UI.
- `backend/`: Express API, JWT authentication, MySQL schema, and 12-course starter catalog.
- First backend start creates the MySQL tables and inserts the 12 starter courses only if the catalog is empty (it does not overwrite an existing catalog).

The seed catalog currently contains 12 courses, 21 modules and 135 lessons.

## Deploy the backend and database on Railway

1. Push the repository with both `Front-page/` and `backend/` at the repository root to GitHub.
2. In Railway, create a project and add a **MySQL** database service.
3. Add a service from the GitHub repository. Set its **Root Directory** to `/backend`.
4. Railway should install dependencies from `backend/package.json` and run `npm start`.
5. In the API service Variables, add:
   - `MYSQLHOST` = `${{MySQL.MYSQLHOST}}`
   - `MYSQLPORT` = `${{MySQL.MYSQLPORT}}`
   - `MYSQLUSER` = `${{MySQL.MYSQLUSER}}`
   - `MYSQLPASSWORD` = `${{MySQL.MYSQLPASSWORD}}`
   - `MYSQLDATABASE` = `${{MySQL.MYSQLDATABASE}}`
   - `JWT_SECRET` = a unique random secret of at least 32 characters
   - `FRONTEND_ORIGINS` = your exact Netlify URL, plus `http://localhost:5500` for local testing (comma-separated)
   - `NODE_ENV` = `production`
6. Generate a public domain for the API service under Settings → Networking.
7. Test `https://YOUR-API-DOMAIN/api/health`. It should return `{ "ok": true, "service": "LearnX LMS API", "database": "connected" }`.

The Railway MySQL service should remain private. Only the Express API needs a public domain. The API connects to MySQL using Railway's private service variables.

## Point the Netlify frontend to the API

Open `Front-page/JS/mysql-config.js` and replace the local default with the API's public HTTPS URL:

```js
window.LEARNX_API_BASE_URL = 'https://YOUR-API-DOMAIN';
```

Commit and push this frontend change to GitHub. Netlify should redeploy the site. The API service's `FRONTEND_ORIGINS` variable must contain the exact Netlify site origin (no trailing slash).

## Create the first admin

After the API is deployed and the database is connected, open a terminal in `backend/` and run:

```bash
npm install
npm run admin:create
```

Enter the admin name, email and a strong password when prompted. This command creates an admin directly in MySQL. Do not make admin registration public. Keep the password private.

## Local development

1. Install Node.js 20 or newer and MySQL 8.
2. Create a database named `learnx_lms`.
3. Copy `backend/.env.example` to `backend/.env` and fill in the local DB credentials and a 32+ character `JWT_SECRET`.
4. In `backend/`, run `npm install`, then `npm start`.
5. Keep `Front-page/JS/mysql-config.js` set to `http://localhost:3000` and serve `Front-page/` with VS Code Live Server.

## Important account/data notes

- Existing LocalStorage users are not automatically migrated because their password hashes are browser-specific. Students should create accounts again. Instructors register as pending and must be approved by an admin.
- Create the first admin using the CLI command above.
- Existing local student progress remains in that browser's LocalStorage. This starter package does not silently erase it, but a separate reviewed migration is needed to move it into MySQL.
- The API currently provides shared course catalog CRUD, authentication, instructor approval via admin user management API, student enrollments and lesson progress endpoints. Other LMS features (assignments, quizzes, submissions, certificates and analytics) still need their own API/database migration before they become cross-device shared data.
- Do not commit `.env`, database credentials, JWT secrets, or MySQL public connection strings.

## Security notes

- Never put MySQL credentials in frontend JavaScript.
- Do not expose Railway MySQL with a public TCP proxy for the deployed application; use private service networking.
- Admins are created by CLI only. Public signup can create students; instructor applications are pending until approved.
- Configure `FRONTEND_ORIGINS` to the exact trusted frontend origins before production use.
